import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CONFIG_KEYS from "../../../config";

interface VideoPlayerProps {
  videoKey: string | null;
  isProductPurchased: boolean | null;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoKey,
  isProductPurchased,
}) => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiResponseData, setApiResponseData] = useState<any>(null);

  const handlePurchaseClick = () => {
    navigate(`/products/${productId}`);
  };

  // 🔧 Get clean token from localStorage
  const getAuthToken = () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return null;
    
    if (token.startsWith('{') && token.endsWith('}')) {
      try {
        const parsed = JSON.parse(token);
        return parsed.accessToken || parsed.token || token;
      } catch (e) {
        console.warn('⚠️ Failed to parse token JSON, using as-is');
        return token;
      }
    }
    
    return token;
  };

  // 📡 Fetch AWS signed URL
  const fetchAWSVideoUrl = async (key: string): Promise<string | null> => {
    try {
      setLoading(true);
      setError(null);
      setApiResponseData(null);
      
      console.group('🚀 FETCHING AWS VIDEO URL');
      console.log('Video key:', key);
      
      const authToken = getAuthToken();
      console.log('Auth token:', authToken ? `${authToken.substring(0, 20)}...` : 'None');
      
      if (!authToken) {
        throw new Error('No authentication token available');
      }
      
      const apiUrl = `${CONFIG_KEYS.API_BASE_URL}/api/video-streaming/stream-video/${encodeURIComponent(key)}`;
      console.log('API URL:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('📡 Response Status:', response.status);
      
      const responseText = await response.text();
      console.log('📄 Raw response:', responseText.substring(0, 200) + '...');
      
      if (!response.ok) {
        console.error('❌ API Error:', responseText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('❌ Failed to parse JSON:', parseError);
        throw new Error(`Invalid JSON response: ${responseText}`);
      }
      
      setApiResponseData(data);
      
      if (data.status === 'success' && data.data) {
        console.log('✅ Got S3 signed URL');
        console.log('✅ URL length:', data.data.length);
        console.groupEnd();
        return data.data;
      } else {
        console.error('❌ Invalid response structure:', data);
        throw new Error(`Invalid response: ${JSON.stringify(data)}`);
      }
      
    } catch (error: any) {
      console.error('❌ Failed to fetch video URL:', error);
      console.groupEnd();
      
      let errorMessage = 'Failed to load video from AWS';
      if (error.message.includes('401')) {
        errorMessage = 'Authentication failed. Please login again.';
      } else if (error.message.includes('403')) {
        errorMessage = 'Access denied.';
      } else if (error.message.includes('404')) {
        errorMessage = 'Video not found.';
      } else {
        errorMessage = `Error: ${error.message}`;
      }
      
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // 🚀 Load video when component mounts or props change
  useEffect(() => {
    const loadVideo = async () => {
      console.group('🎬 VIDEO PLAYER LOAD');
      console.log('Props:', { videoKey, isProductPurchased });
      
      // Reset states
      setVideoUrl(null);
      setError(null);
      setApiResponseData(null);
      
      // Check if product is purchased and video key exists
      if (!isProductPurchased) {
        console.log('🔒 Product not purchased');
        console.groupEnd();
        return;
      }
      
      if (!videoKey) {
        console.warn('⚠️ No video key provided');
        setError('No video available for this lesson');
        console.groupEnd();
        return;
      }
      
      // Fetch video URL
      const url = await fetchAWSVideoUrl(videoKey);
      if (url) {
        console.log('✅ Setting video URL');
        setVideoUrl(url);
        
        // 🔧 No CORS test - let video element handle it directly
        console.log('🎥 Video URL set, letting HTML5 video handle loading');
      } else {
        console.error('❌ No URL received from API');
      }
      
      console.groupEnd();
    };
    
    loadVideo();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoKey, isProductPurchased]);

  // 📱 Loading state
  if (loading) {
    return (
      <div className='flex items-center justify-center h-64 bg-gray-100 rounded-lg'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
          <span className='mt-2 text-gray-600'>Loading video from S3...</span>
          <div className='text-xs text-gray-500 mt-1'>Getting signed URL</div>
        </div>
      </div>
    );
  }

  // ❌ Error state
  if (error) {
    return (
      <div className='flex items-center justify-center h-64 bg-red-50 border border-red-200 rounded-lg'>
        <div className='text-center p-4 max-w-md'>
          <div className='text-red-500 text-lg mb-2'>❌ Video Error</div>
          <div className='text-red-600 text-sm mb-4'>{error}</div>
          <div className='space-x-2 mb-4'>
            <button 
              onClick={() => {
                setError(null);
                if (videoKey) {
                  fetchAWSVideoUrl(videoKey).then(url => {
                    if (url) setVideoUrl(url);
                  });
                }
              }} 
              className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
            >
              Retry Load
            </button>
            <button 
              onClick={() => window.location.reload()} 
              className='px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600'
            >
              Reload Page
            </button>
          </div>
          
          {/* Debug info */}
          {process.env.NODE_ENV === 'development' && (
            <details className='text-left'>
              <summary className='cursor-pointer text-xs font-semibold'>🔍 Debug Info</summary>
              <div className='mt-2 p-2 bg-gray-100 text-xs rounded space-y-1'>
                <div><strong>Video Key:</strong> {videoKey}</div>
                <div><strong>Is Purchased:</strong> {String(isProductPurchased)}</div>
                <div><strong>Video URL:</strong> {videoUrl ? 'Generated' : 'None'}</div>
                <div><strong>Auth Token:</strong> {getAuthToken() ? 'Present' : 'Missing'}</div>
                {apiResponseData && (
                  <div>
                    <strong>URL Type:</strong> {apiResponseData.data?.includes('X-Amz-Algorithm') ? 'S3 Signed URL' : 'Direct URL'}
                  </div>
                )}
                <div className='text-xs text-blue-600 mt-2'>
                  💡 Open browser console (F12) for detailed logs
                </div>
              </div>
            </details>
          )}
        </div>
      </div>
    );
  }

  // 🔒 Purchase overlay
  if (!isProductPurchased) {
    return (
      <div className='flex items-center justify-center h-64 bg-black bg-opacity-90 rounded-lg'>
        <div className='text-center text-white p-8'>
          <div className='w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4'>
            <span className='text-black text-3xl'>🔒</span>
          </div>
          <h2 className='text-2xl font-semibold mb-2'>Video is locked</h2>
          <p className='text-lg text-gray-300 mb-4'>
            Please purchase the product to unlock this content
          </p>
          <button 
            onClick={handlePurchaseClick} 
            className='bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors'
          >
            Purchase Product
          </button>
        </div>
      </div>
    );
  }

  // 📹 Video player with S3 signed URL
  if (videoUrl) {
    return (
      <div className='relative w-full h-full bg-black rounded-lg overflow-hidden'>
        <video
          ref={videoRef}
          controls
          className='w-full h-full object-contain'
          preload="metadata"
          // 🔧 Remove crossOrigin since it can cause CORS issues with signed URLs
          onLoadStart={() => {
            console.log('📡 Video load started');
            console.log('📡 Video source set');
          }}
          onLoadedMetadata={(e) => {
            const video = e.target as HTMLVideoElement;
            console.log('✅ Video metadata loaded:', {
              duration: video.duration,
              dimensions: `${video.videoWidth}x${video.videoHeight}`,
              readyState: video.readyState
            });
          }}
          onCanPlay={() => {
            console.log('✅ Video can play - SUCCESS!');
          }}
          onPlay={() => {
            console.log('▶️ Video started playing - SUCCESS!');
          }}
          onPause={() => console.log('⏸️ Video paused')}
          onEnded={() => console.log('🏁 Video ended')}
          onError={(e) => {
            const video = e.target as HTMLVideoElement;
            const error = video.error;
            
            console.error('❌ Video playback error:', {
              error,
              code: error?.code,
              message: error?.message,
              src: video.src.substring(0, 100) + '...',
              readyState: video.readyState,
              networkState: video.networkState
            });
            
            if (error) {
              const errorMessages = {
                1: 'Video loading aborted by user',
                2: 'Network error loading video from S3',
                3: 'Video decode error - format not supported',
                4: 'Video source not supported or S3 URL expired'
              };
              const errorMessage = errorMessages[error.code as keyof typeof errorMessages] || 'Unknown video error';
              
              // 🔧 More specific S3 error handling
              if (error.code === 2) {
                setError('Network error: Check internet connection or S3 permissions');
              } else if (error.code === 4) {
                setError('Video format not supported or S3 URL expired. Try refreshing.');
              } else {
                setError(`Video Error: ${errorMessage}`);
              }
            }
          }}
          onWaiting={() => console.log('⏳ Video buffering')}
          onSuspend={() => console.log('⏸️ Video loading suspended')}
          onAbort={() => console.log('❌ Video loading aborted')}
          onStalled={() => console.log('⏳ Video stalled')}
        >
          <source src={videoUrl} type="video/mp4" />
          
          {/* Fallback message */}
          <p className='text-white text-center p-4'>
            Your browser does not support the video tag. 
            <br />
            <a 
              href={videoUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className='text-blue-400 underline hover:text-blue-300'
            >
              Click here to download video directly
            </a>
          </p>
        </video>
        
        {/* Video info in development
        {process.env.NODE_ENV === 'development' && (
          <div className='absolute top-2 left-2 bg-black bg-opacity-75 text-white text-xs p-2 rounded max-w-xs'>
            <div className='font-bold mb-1'>🎥 S3 Video Debug</div>
            <div>Type: {videoUrl.includes('X-Amz-Algorithm') ? 'Signed URL' : 'Direct URL'}</div>
            <div>Key: {videoKey?.substring(0, 16)}...</div>
            <div>Expires: {videoUrl.includes('X-Amz-Expires') ? '1 hour' : 'No expiry'}</div>
            {apiResponseData?.metadata && (
              <div>Fetched: {new Date(apiResponseData.metadata.timestamp).toLocaleTimeString()}</div>
            )}
          </div>
        )} */}
      </div>
    );
  }

  // 🔄 No video state
  return (
    <div className='flex items-center justify-center h-64 bg-gray-100 rounded-lg'>
      <div className='text-center text-gray-500'>
        <div className='text-4xl mb-2'>📹</div>
        <div>No video available</div>
        {videoKey && (
          <button 
            onClick={() => {
              if (videoKey) {
                fetchAWSVideoUrl(videoKey).then(url => {
                  if (url) setVideoUrl(url);
                });
              }
            }}
            className='mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
          >
            Load Video
          </button>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;


























