"use client"
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Calendar,
  List,
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Volume1,
  SkipBack,
  SkipForward,
  Loader,
  UserCircle2
} from 'lucide-react';

const LoadingSkeleton = () => (
  <div className="animate-pulse">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3].map((item) => (
        <div key={item} className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-12 bg-gray-200 rounded w-full mt-2"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const AudioPlayer = ({ url, title, duration: totalDuration, className, ReciverName }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.75);
  const [isMuted, setIsMuted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  const audioRef = useRef(null);
  const progressBarRef = useRef(null);
  const volumeTimeoutRef = useRef(null);

  useEffect(() => {
    const audio = new Audio(url);
    audioRef.current = audio;

    audio.volume = volume;

    const handleLoadedData = () => {
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      if (!isDragging) {
        setCurrentTime(audio.currentTime);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
      audio.src = '';
    };
  }, [url, isDragging, volume]);

  const togglePlay = (e) => {
    e.stopPropagation();
    if (isLoading) return;

    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressClick = (e) => {
    e.stopPropagation();
    if (isLoading) return;

    const bounds = progressBarRef.current.getBoundingClientRect();
    const percent = (e.clientX - bounds.left) / bounds.width;
    const newTime = percent * totalDuration;

    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e) => {
    e.stopPropagation();
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    if (isMuted) {
      setIsMuted(false);
      setVolume(0.75);
      if (audioRef.current) {
        audioRef.current.volume = 0.75;
      }
    } else {
      setIsMuted(true);
      setVolume(0);
      if (audioRef.current) {
        audioRef.current.volume = 0;
      }
    }
  };

  const skip = (seconds) => (e) => {
    e.stopPropagation();
    if (isLoading || !audioRef.current) return;

    const newTime = Math.min(
      Math.max(audioRef.current.currentTime + seconds, 0),
      totalDuration
    );
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return <VolumeX size={18} />;
    if (volume < 0.5) return <Volume1 size={18} />;
    return <Volume2 size={18} />;
  };

  const handleVolumeMouseEnter = () => {
    if (volumeTimeoutRef.current) {
      clearTimeout(volumeTimeoutRef.current);
    }
    setShowVolumeSlider(true);
  };

  const handleVolumeMouseLeave = () => {
    volumeTimeoutRef.current = setTimeout(() => {
      setShowVolumeSlider(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col gap-2 bg-white p-3 rounded-lg shadow-sm border border-gray-100">
      <div className="space-y-3 p-4 bg-white rounded-lg shadow-sm">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <UserCircle2 size={18} className="text-blue-500 flex-shrink-0" />
          <span>Caller Name: {className}</span>
        </div>

        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <UserCircle2 size={18} className="text-blue-500 flex-shrink-0" />
          <span>Receiver Name: {ReciverName}</span>
        </div>
      </div>

      <div
        ref={progressBarRef}
        className="relative h-2 bg-gray-200 rounded-full cursor-pointer group"
        onClick={handleProgressClick}
      >
        <div
          className="absolute h-full bg-gray-300 rounded-full"
          style={{ width: `${(currentTime / totalDuration) * 100}%` }}
        />
        <div
          className="absolute h-full bg-blue-500 rounded-full"
          style={{ width: `${(currentTime / totalDuration) * 100}%` }}
        />
        <div className="absolute h-full w-full rounded-full opacity-0 group-hover:opacity-100 bg-blue-200/20 transition-opacity" />
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={skip(-10)}
            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
            disabled={isLoading}
          >
            <SkipBack size={16} className="text-gray-600" />
          </button>

          <button
            onClick={togglePlay}
            className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 transition-colors text-white disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader size={18} className="animate-spin" />
            ) : isPlaying ? (
              <Pause size={18} />
            ) : (
              <Play size={18} className="ml-0.5" />
            )}
          </button>

          <button
            onClick={skip(10)}
            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
            disabled={isLoading}
          >
            <SkipForward size={16} className="text-gray-600" />
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-500 min-w-[115px]">
          <span>{formatTime(currentTime)}</span>
          <span>/</span>
          <span>{formatTime(totalDuration)}</span>
        </div>

        <div
          className="relative flex items-center gap-2"
          onMouseEnter={handleVolumeMouseEnter}
          onMouseLeave={handleVolumeMouseLeave}
        >
          <button
            onClick={toggleMute}
            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
          >
            {getVolumeIcon()}
          </button>

          <div className={`
            absolute right-0 bottom-full mb-2 p-2 bg-white rounded-lg shadow-lg border border-gray-200
            transition-all duration-200 origin-bottom-right
            ${showVolumeSlider ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}
          `}>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-24 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:w-3
                [&::-webkit-slider-thumb]:h-3
                [&::-webkit-slider-thumb]:bg-blue-500
                [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:cursor-pointer
                [&::-webkit-slider-thumb]:hover:bg-blue-600
                [&::-webkit-slider-thumb]:transition-colors"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const RecordingCard = ({ recording, onClick }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div
      onClick={() => onClick(recording)}
      className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-blue-200"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Volume2 size={18} className="text-blue-500" />
          <span className="font-medium text-gray-700">
            Recording {recording._id.slice(-4)}
          </span>
        </div>
        <span className="text-xs text-gray-500">
          {formatDate(recording.createdAt)}
        </span>
      </div>

      <div className="text-sm text-gray-600">
        <div className="mb-2 truncate">{recording.title || 'Untitled Recording'}</div>
        <AudioPlayer
          url={recording.audioUrl}
          className={recording.callerId?.username || 'Unknown'}
          ReciverName={recording.userId?.username || 'Unknown'}
          title={recording.title}
          duration={recording.duration}
        />
      </div>
    </div>
  );
};

const DateRangePicker = ({ onChange }) => {
  const [dates, setDates] = useState({ fromDate: '', toDate: '' });

  const handleChange = (type, value) => {
    const newDates = { ...dates, [type]: value };
    setDates(newDates);
    onChange(newDates);
  };

  return (
    <div className="flex flex-wrap gap-4 bg-white p-4 rounded-lg shadow-sm">
      <div className="flex items-center gap-2">
        <Calendar size={18} className="text-blue-500" />
        <input
          type="date"
          value={dates.fromDate}
          onChange={(e) => handleChange('fromDate', e.target.value)}
          className="border border-gray-200 rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          aria-label="From date"
        />
      </div>
      <div className="flex items-center gap-2">
        <Calendar size={18} className="text-blue-500" />
        <input
          type="date"
          value={dates.toDate}
          onChange={(e) => handleChange('toDate', e.target.value)}
          className="border border-gray-200 rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          aria-label="To date"
        />
      </div>
    </div>
  );
};

const AudioRecordings = ({ isOpen, onClose, userId }) => {
  const [recordings, setRecordings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedRecording, setSelectedRecording] = useState(null);
  const [dateRange, setDateRange] = useState({
    fromDate: null,
    toDate: null
  });

  const fetchRecordings = useCallback(async (pageNum = 1, reset = false) => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams({
        userId,
        page: pageNum.toString(),
        limit: '9'
      });

      if (dateRange.fromDate) queryParams.append('fromDate', dateRange.fromDate);
      if (dateRange.toDate) queryParams.append('toDate', dateRange.toDate);

      const response = await fetch(`/api/recoding?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch recordings: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch recordings');
      }

      setRecordings(prev => 
        reset || pageNum === 1 ? data.data : [...prev, ...data.data]
      );
      setHasMore(data.data.length === 9);
    } catch (err) {
      setError(err.message);
      if (pageNum === 1) {
        setRecordings([]);
      }
    } finally {
      setLoading(false);
    }
  }, [userId, dateRange]);

  useEffect(() => {
    if (isOpen) {
      setPage(1);
      fetchRecordings(1, true);
    }
  }, [isOpen, dateRange, userId, fetchRecordings]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchRecordings(nextPage);
  };

  const handleDateRangeChange = useCallback(({ fromDate, toDate }) => {
    setDateRange({ fromDate, toDate });
    setPage(1);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-50 rounded-xl w-full max-w-7xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-4 bg-white border-b border-gray-200 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Call Recordings</h1>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close"
          >
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        <div className="p-4">
          <DateRangePicker onChange={handleDateRangeChange} />
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              <p className="flex items-center gap-2">
                <span className="font-medium">Error:</span> {error}
              </p>
            </div>
          )}

          {loading && page === 1 ? (
            <LoadingSkeleton />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recordings.map((recording) => (
                  <RecordingCard
                    key={recording._id}
                    recording={recording}
                    onClick={setSelectedRecording}
                  />
                ))}
              </div>

              {loading && page > 1 && (
                <div className="flex justify-center mt-6">
                  <Loader className="animate-spin" size={24} />
                </div>
              )}

              {!loading && recordings.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-2">
                    <List size={48} className="mx-auto" />
                  </div>
                  <p className="text-gray-500">No recordings found</p>
                </div>
              )}

              {!loading && hasMore && recordings.length > 0 && (
                <button
                  onClick={handleLoadMore}
                  className="mt-6 w-full py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Load More
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {selectedRecording && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60]"
          onClick={() => setSelectedRecording(null)}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4 pb-2 border-b">
              <h2 className="text-xl font-bold text-gray-800">Call Details</h2>
              <button
                onClick={() => setSelectedRecording(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Caller</span>
                <span className="font-medium">{selectedRecording.callerId?.username || 'Unknown'}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Caller Service</span>
                <span className="font-medium">{selectedRecording.callerId?.serviceType || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Receiver</span>
                <span className="font-medium">{selectedRecording.userId?.username || 'Unknown'}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Receiver Service</span>
                <span className="font-medium">{selectedRecording.userId?.serviceType || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Status</span>
                <span className="font-medium capitalize">{selectedRecording.status || 'completed'}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-600">Duration</span>
                <span className="font-medium">
                  {Math.floor(selectedRecording.duration / 60)}:
                  {String(Math.floor(selectedRecording.duration % 60)).padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioRecordings;