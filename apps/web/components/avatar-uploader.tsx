"use client";

import Cropper, { type Area } from "react-easy-crop";
import { useState } from "react";

async function cropImage(source: string, area: Area) {
  const image = new Image();
  image.src = source;
  await new Promise((resolve, reject) => { image.onload = resolve; image.onerror = reject; });
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 512;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas unavailable");
  context.drawImage(image, area.x, area.y, area.width, area.height, 0, 0, 512, 512);
  return canvas.toDataURL("image/webp", 0.9);
}

export function AvatarUploader({ currentUrl }: { currentUrl?: string | null }) {
  const [source, setSource] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [area, setArea] = useState<Area | null>(null);
  const [avatarData, setAvatarData] = useState("");
  const preview = avatarData || currentUrl;
  return <div className="field"><label htmlFor="avatar">Profile image</label>{preview && <img src={preview} alt="Profile preview" style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover" }}/>}<input id="avatar" type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => { const file = event.target.files?.[0]; if (file) setSource(URL.createObjectURL(file)); }}/>{source && <><div style={{ position: "relative", height: 280, background: "#222", borderRadius: 12, overflow: "hidden" }}><Cropper image={source} crop={crop} zoom={zoom} aspect={1} onCropChange={setCrop} onZoomChange={setZoom} onCropComplete={(_, pixels) => setArea(pixels)}/></div><input type="range" min={1} max={3} step={0.1} value={zoom} onChange={(event) => setZoom(Number(event.target.value))}/><button type="button" className="button button-ghost" onClick={async () => { if (area) setAvatarData(await cropImage(source, area)); }}>Apply crop</button></>}<input type="hidden" name="avatarData" value={avatarData}/></div>;
}
