export interface CameraDeviceInfo {
  deviceId: string
  label: string
}

export async function requestCameraStream(
  deviceId?: string
): Promise<MediaStream> {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error('Camera access is not supported by this browser environment.')
  }

  const constraints: MediaStreamConstraints = {
    audio: false,
    video: deviceId
      ? { deviceId: { exact: deviceId } }
      : {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 }
        }
  }

  try {
    return await navigator.mediaDevices.getUserMedia(constraints)
  } catch (err: unknown) {
    const error = err as { name?: string; message?: string }
    if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
      throw new Error('Camera permission denied. Please grant camera permission in your browser URL bar.')
    } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
      throw new Error('No video camera device detected. Please attach a webcam and retry.')
    } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
      throw new Error('Camera is currently in use by another application. Please close other software using the camera.')
    } else {
      throw new Error(error.message || 'Unable to initialize webcam stream.')
    }
  }
}

export function stopMediaStream(stream: MediaStream | null): void {
  if (!stream) return
  try {
    stream.getTracks().forEach((track) => {
      track.stop()
    })
  } catch (err) {
    console.warn('[EcoSort AI] Error stopping media tracks:', err)
  }
}

export function captureSnapshot(video: HTMLVideoElement): string {
  if (!video || !video.videoWidth || !video.videoHeight) {
    return ''
  }

  try {
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return ''

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    return canvas.toDataURL('image/jpeg', 0.88)
  } catch (err) {
    console.error('[EcoSort AI] Error capturing video snapshot:', err)
    return ''
  }
}

export async function getAvailableCameras(): Promise<CameraDeviceInfo[]> {
  if (!navigator.mediaDevices?.enumerateDevices) {
    return []
  }
  try {
    const devices = await navigator.mediaDevices.enumerateDevices()
    return devices
      .filter((d) => d.kind === 'videoinput')
      .map((d, index) => ({
        deviceId: d.deviceId,
        label: d.label || `Camera ${index + 1}`
      }))
  } catch (err) {
    console.warn('[EcoSort AI] Error enumerating video devices:', err)
    return []
  }
}
