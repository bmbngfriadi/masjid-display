import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Settings, Save, MapPin, Clock, Moon, Volume2, ShieldAlert, Play, Square } from 'lucide-react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

function LocationMarker({ position, setPosition }) {
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng.lat, e.latlng.lng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return (
    <Marker 
      position={position} 
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          const marker = e.target;
          const pos = marker.getLatLng();
          setPosition(pos.lat, pos.lng);
          map.flyTo(pos, map.getZoom());
        },
      }}
    ></Marker>
  );
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/masjid/api';

export default function PrayerTimeConfig() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [cities, setCities] = useState([]);
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    fetchConfig();
    fetchCities();
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
  }, []);

  const fetchCities = async () => {
    try {
      const res = await axios.get('https://api.myquran.com/v2/sholat/kota/semua');
      if (res.data && res.data.data) {
        setCities(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch cities from MyQuran API', err);
    }
  };

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token');
      const res = await axios.get(`${API_BASE_URL}/prayer-config`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setConfig(res.data);
    } catch (err) {
      console.error('Failed to fetch config', err);
      setError('Gagal mengambil pengaturan waktu sholat.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');
      const token = localStorage.getItem('admin_token');
      await axios.put(`${API_BASE_URL}/prayer-config`, config, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Pengaturan waktu sholat berhasil disimpan!');
    } catch (err) {
      console.error('Failed to save config', err);
      setError('Gagal menyimpan pengaturan.');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const previewSound = () => {
    if (isPlayingSound) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setIsPlayingSound(false);
      return;
    }

    if (!config.alarmSound || config.alarmSound === 'none') {
      return;
    }

    let url = '';
    if (config.alarmSound === 'beep') {
      url = 'https://actions.google.com/sounds/v1/alarms/beep_short.ogg';
    } else if (config.alarmSound === 'adhan_makkah') {
      url = 'https://download.quranicaudio.com/adhan/makkah.mp3';
    } else if (config.alarmSound === 'adhan_madinah') {
      url = 'https://download.quranicaudio.com/adhan/madinah.mp3';
    }

    if (url) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const audio = new Audio(url);
      audioRef.current = audio;
      setIsPlayingSound(true);
      audio.play().catch(e => {
        console.error("Audio play failed:", e);
        setIsPlayingSound(false);
      });
      audio.onended = () => {
        setIsPlayingSound(false);
      };
    }
  };

  if (loading) return (
    <div className="p-8 text-center text-[var(--text-secondary)] font-medium flex items-center justify-center gap-3">
      <span className="w-5 h-5 border-2 border-[var(--primary-500)] border-t-transparent rounded-full animate-spin"></span>
      Memuat konfigurasi...
    </div>
  );

  return (
    <div className="w-full pb-12">
      <div className="page-header sticky top-4 z-40 bg-[var(--bg-color)]/80 backdrop-blur-md p-4 -mx-4 rounded-b-2xl border-b border-[var(--border-color)]">
        <div>
          <h2 className="page-title">Waktu Sholat</h2>
          <p className="text-[var(--text-secondary)]">Konfigurasi jadwal sholat, jeda iqamah, dan pengaturan mode khusus.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary mt-4 md:mt-0 shadow-lg shadow-[var(--primary-500)]/30"
        >
          <Save size={18} />
          {saving ? 'Menyimpan...' : 'Simpan Pengaturan'}
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-sm font-medium text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}
      
      {success && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 flex items-start gap-3">
          <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">{success}</p>
        </div>
      )}

      <div className="space-y-6">
        {/* Section 1: Calculation Method */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--border-color)]">
            <MapPin className="text-[var(--primary-500)]" />
            <div>
              <h3 className="text-lg font-bold text-[var(--text-primary)]">Prayer Calculation Method</h3>
              <p className="text-sm text-[var(--text-secondary)]">Configuration to calculate prayer times at your location.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="form-group">
              <label className="form-label">Latitude</label>
              <input
                type="number"
                step="0.000001"
                value={config.latitude}
                onChange={(e) => handleChange('latitude', parseFloat(e.target.value))}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Longitude</label>
              <input
                type="number"
                step="0.000001"
                value={config.longitude}
                onChange={(e) => handleChange('longitude', parseFloat(e.target.value))}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Calculation Method</label>
              <select
                value={config.calculationMethod}
                onChange={(e) => handleChange('calculationMethod', e.target.value)}
                className="form-control"
              >
                <option value="Kemenag">Kemenag RI (Indonesia)</option>
                <option value="Singapore">MUIS (Singapore / SIHAT)</option>
                <option value="MuslimWorldLeague">Muslim World League</option>
                <option value="Egyptian">Egyptian General Authority</option>
                <option value="Makkah">Umm Al-Qura Univ. Makkah</option>
              </select>
            </div>
            
            {config.calculationMethod === 'Kemenag' && (
              <div className="form-group md:col-span-3 border-t border-[var(--border-color)] pt-4 mt-2">
                <label className="form-label">Kota/Kab</label>
                <p className="text-xs text-[var(--text-secondary)] mb-2">Select city below if you choose KEMENAG as calculation method.</p>
                <select
                  value={config.cityId || '0506'}
                  onChange={(e) => handleChange('cityId', e.target.value)}
                  className="form-control"
                >
                  {cities.map(city => (
                    <option key={city.id} value={city.id}>{city.lokasi}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Map Coordinates */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--border-color)]">
            <MapPin className="text-[var(--primary-500)]" />
            <div>
              <h3 className="text-lg font-bold text-[var(--text-primary)]">Masjid Coordinates Map</h3>
              <p className="text-sm text-[var(--text-secondary)]">Klik di mana saja pada peta atau geser pin untuk mengatur koordinat secara presisi.</p>
            </div>
          </div>
          <div className="w-full rounded-xl overflow-hidden shadow-inner border border-[var(--border-color)] bg-slate-100 dark:bg-slate-800 relative z-0" style={{ height: '400px' }}>
            {config.latitude && config.longitude ? (
              <MapContainer 
                center={[config.latitude, config.longitude]} 
                zoom={15} 
                scrollWheelZoom={true} 
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker 
                  position={{ lat: config.latitude, lng: config.longitude }}
                  setPosition={(lat, lng) => {
                    handleChange('latitude', lat);
                    handleChange('longitude', lng);
                  }}
                />
              </MapContainer>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-[var(--text-secondary)]">
                <MapPin className="w-12 h-12 mb-2 opacity-50" />
                <p>Silakan masukkan koordinat Latitude dan Longitude.</p>
              </div>
            )}
          </div>
        </div>

        {/* Section 2: Manual Corrections */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--border-color)]">
            <Settings className="text-[var(--primary-500)]" />
            <div>
              <h3 className="text-lg font-bold text-[var(--text-primary)]">Manual Corrections</h3>
              <p className="text-sm text-[var(--text-secondary)]">Adjust each prayer time by adding or subtracting the time if necessary (in minutes).</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'].map(prayer => (
              <div key={prayer} className="form-group">
                <label className="form-label capitalize">{prayer}</label>
                <input
                  type="number"
                  value={config[`${prayer}Offset`]}
                  onChange={(e) => handleChange(`${prayer}Offset`, parseInt(e.target.value))}
                  className="form-control"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Special Modes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          

          {/* Ramadan */}
          <div className="glass-card p-6 flex flex-col justify-between cursor-pointer hover:border-[var(--primary-500)] transition-colors" onClick={() => handleChange('ramadanMode', !config.ramadanMode)}>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-bold text-[var(--text-primary)]">Ramadan</h3>
                <Moon size={18} className="text-[var(--primary-500)]" />
              </div>
              <p className="text-sm text-[var(--text-secondary)] mb-6">Enable Imsak time display and Taraweeh khusyuk screens during Ramadan month.</p>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[var(--text-primary)]">Status</span>
              <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${config.ramadanMode ? 'bg-[var(--primary-500)]' : 'bg-slate-300 dark:bg-slate-700'}`}>
                <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-300 ${config.ramadanMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
              </div>
            </div>
          </div>

        </div>

        {/* Section 5: Prayer Alarm Sound */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--border-color)]">
            <Volume2 className="text-[var(--primary-500)]" />
            <div>
              <h3 className="text-lg font-bold text-[var(--text-primary)]">Prayer Alarm Sound</h3>
              <p className="text-sm text-[var(--text-secondary)]">Select the alarm sound that will play during azan and iqamah time.</p>
            </div>
          </div>
          
          <div className="flex items-end gap-3 max-w-md">
            <div className="form-group flex-1 mb-0">
              <select
                value={config.alarmSound}
                onChange={(e) => handleChange('alarmSound', e.target.value)}
                className="form-control"
              >
                <option value="none">Silent (No Sound)</option>
                <option value="beep">Beep Alert (Standard)</option>
                <option value="adhan_makkah">Full Adhan (Makkah)</option>
                <option value="adhan_madinah">Full Adhan (Madinah)</option>
              </select>
            </div>
            <button 
              onClick={previewSound}
              disabled={config.alarmSound === 'none'}
              className="bg-[var(--primary-500)] text-white p-3 rounded-xl hover:bg-[var(--primary-600)] transition-colors disabled:opacity-50 flex-shrink-0 flex items-center justify-center w-12 h-12 shadow-sm"
              title="Preview Sound"
            >
              {isPlayingSound ? <Square size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
