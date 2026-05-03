import { useEffect, useRef } from 'react';
import { renderGreeting } from '../utils/canvas.js';

export default function TemplatePreview({
  template,
  name,
  profilePic,
  maxWidth = 400,
  aspectRatio,
  className = '',
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !template?.imageUrl) return;
    renderGreeting({
      canvas: canvasRef.current,
      templateUrl: template.imageUrl,
      name,
      profilePic,
      overlayConfig: template.overlayConfig,
      maxWidth,
      aspectRatio,
    }).catch(() => {
      /* swallow render errors in preview */
    });
  }, [template, name, profilePic, maxWidth, aspectRatio]);

  return <canvas ref={canvasRef} className={`block w-full h-auto ${className}`} />;
}
