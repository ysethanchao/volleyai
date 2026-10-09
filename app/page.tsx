'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Upload, Activity, AlertTriangle, UserCheck, Trophy, Dumbbell, ShieldAlert, Play, Pause, Eye } from 'lucide-react';

export default function Home() {
  const [selectedAction, setSelectedAction] = useState('扣球');
  const [activeTab, setActiveTab] = useState('report'); // report | proCompare | physio
  const [viewMode, setViewMode] = useState('both'); // video | skeleton | both
  const [isPlaying, setIsPlaying] = useState(true);
  
  // 個人數據
  const [userInfo, setUserInfo] = useState({
    age: 20,
    height: 178,
    weight: 70,
    armSpan: 182,
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // 模擬 3D/2D 骨架繪製動畫
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let t = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (viewMode === 'skeleton' || viewMode === 'both') {
        t += 0.05;
        const swing = Math.sin(t) * 20;

        // 背景幾何網格 (模擬 3D 空間)
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1;
        for (let i = 0; i < canvas.width; i += 40) {
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i, canvas.height);
          ctx.stroke();
        }

        // 模擬動態人體骨架點位 (X, Y)
        const head = { x: 200, y: 120 + Math.cos(t) * 5 };
        const neck = { x: 200, y: 150 };
        const rShoulder = { x: 170, y: 160 };
        const lShoulder = { x: 230, y: 160 };
        const rElbow = { x: 140 + swing, y: 130 - swing };
        const rWrist = { x: 120 + swing * 1.5, y: 90 - swing * 1.2 };
        const spine = { x: 200, y: 230 };
        const rHip = { x: 185, y: 230 };
        const lHip = { x: 215, y: 230 };
        const rKnee = { x: 180, y: 290 };
        const rAnkle = { x: 175, y: 340 };

        // 畫骨架連線
        ctx.strokeStyle = '#f59e0b'; // 琥珀黃骨架
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';

        const connections = [
          [head, neck], [neck, spine],
          [neck, rShoulder], [rShoulder, rElbow], [rElbow, rWrist],
          [spine, rHip], [spine, lHip],
          [rHip, rKnee], [rKnee, rAnkle]
        ];

        connections.forEach(([p1, p2]) => {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        });

        // 畫關鍵節點
        [head, neck, rShoulder, lShoulder, rElbow, rWrist, spine, rHip, lHip, rKnee, rAnkle].forEach((p) => {
          ctx.fillStyle = '#10b981';
          ctx.beginPath();
          ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      if (isPlaying) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [viewMode, isPlaying]);

  const actions = ['扣球', '接球', '發球', '攔網', '舉球'];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans">
      {/* 頁頭 Header */}
      <header className="max-w-7xl mx-auto flex items-center justify-between pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-xl">
            🏐
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wide text-white">VolleyAI Pro</h1>
            <p className="text-xs text-slate-400">AI 排球動作分析與私人防護員系統</p>
          </div>
        </div>

        <div className="flex gap-2">
          {actions.map((act) => (
            <button
              key={act}
              onClick={() => setSelectedAction(act)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                selectedAction === act
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-lg shadow-amber-500/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {act}
            </button>
          ))}
        </div>
      </header>

      {/* 主體區 */}
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        
        {/* 左側：3D 骨架與影片畫布播放區 */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative aspect-video bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden flex items-center justify-center">
            
            {/* 動態 3D/2D 骨架 Canvas */}
            <canvas
              ref={canvasRef}
              width={640}
              height={360}
              className="absolute inset-0 w-full h-full object-cover z-10 pointer-events-none"
            />

            {/* 上傳提示蓋板 */}
            <div className="text-center z-20 space-y-3 bg-slate-950/40 p-6 rounded-2xl backdrop-blur-sm border border-slate-800/50">
              <div className="w-12 h-12 mx-auto rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform">
                <Upload className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-200">上傳你的{selectedAction}影片 (.mp4)</p>
                <p className="text-xs text-slate-400 mt-1">目前模式：{viewMode === 'both' ? '影片+3D骨架疊加' : viewMode}</p>
              </div>
            </div>

            {/* 視角與模式切換鈕 */}
            <div className="absolute top-4 left-4 z-30 flex bg-slate-950/80 backdrop-blur border border-slate-800 rounded-lg p-1 gap-1">
              {[
                { id: 'video', label: '原影片' },
                { id: 'skeleton', label: '3D純骨架' },
                { id: 'both', label: '骨架疊加' }
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setViewMode(m.id)}
                  className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
                    viewMode === m.id ? 'bg-amber-500 text-slate-950 font-medium' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* 播放控制 */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="absolute bottom-4 right-4 z-30 bg-slate-950/80 border border-slate-800 text-slate-200 p-2 rounded-lg hover:text-amber-400 transition-colors"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
          </div>

          {/* 個人數據輸入 */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-amber-400" /> 個人身體數據設定
            </h2>
            <div className="grid grid-cols-4 gap-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">年齡 (歲)</label>
                <input
                  type="number"
                  value={userInfo.age}
                  onChange={(e) => setUserInfo({ ...userInfo, age: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">身高 (cm)</label>
                <input
                  type="number"
                  value={userInfo.height}
                  onChange={(e) => setUserInfo({ ...userInfo, height: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">體重 (kg)</label>
                <input
                  type="number"
                  value={userInfo.weight}
                  onChange={(e) => setUserInfo({ ...userInfo, weight: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">臂展 (cm)</label>
                <input
                  type="number"
                  value={userInfo.armSpan}
                  onChange={(e) => setUserInfo({ ...userInfo, armSpan: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 右側：AI 教練與防護員分頁報告 */}
        <div className="space-y-4">
          <div className="flex border-b border-slate-800 gap-4 text-sm font-medium">
            <button
              onClick={() => setActiveTab('report')}
              className={`pb-2 transition-all ${
                activeTab === 'report' ? 'border-b-2 border-amber-500 text-amber-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              📋 AI 診斷報告
            </button>
            <button
              onClick={() => setActiveTab('proCompare')}
              className={`pb-2 transition-all ${
                activeTab === 'proCompare' ? 'border-b-2 border-amber-500 text-amber-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              🌐 職業對比
            </button>
            <button
              onClick={() => setActiveTab('physio')}
              className={`pb-2 transition-all ${
                activeTab === 'physio' ? 'border-b-2 border-amber-500 text-amber-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              🏥 私人防護員
            </button>
          </div>

          {activeTab === 'report' && (
            <div className="space-y-4">
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
                <h3 className="text-sm font-semibold text-amber-400 flex items-center gap-2">
                  <Activity className="w-4 h-4" /> {selectedAction}數據診斷
                </h3>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                    <p className="text-[10px] text-slate-400">擊球點預估</p>
                    <p className="text-base font-bold text-emerald-400 mt-0.5">308 cm</p>
                  </div>
                  <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                    <p className="text-[10px] text-slate-400">引臂肘角度</p>
                    <p className="text-base font-bold text-amber-400 mt-0.5">82° (偏低)</p>
                  </div>
                  <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                    <p className="text-[10px] text-slate-400">揮臂角速度</p>
                    <p className="text-base font-bold text-emerald-400 mt-0.5">1120 °/s</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
                <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-400" /> 位置契合度分析
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center p-2 rounded-lg bg-amber-500/10 border border-amber-500/30">
                    <span className="font-semibold text-amber-300">1. 主攻手 (OH)</span>
                    <span className="text-amber-400 font-bold">88%</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-300">2. 自由球員 (L)</span>
                    <span className="text-slate-400">75%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'proCompare' && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
              <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" /> 職業選手發力鏈對比
              </h3>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-2">
                <div className="flex justify-between text-slate-300 font-semibold border-b border-slate-800 pb-2">
                  <span>指標</span>
                  <span>你的數據</span>
                  <span>石川祐希 (日本)</span>
                </div>
                <div className="flex justify-between text-slate-400 py-1">
                  <span>滯空胸椎展角</span>
                  <span className="text-amber-400">18°</span>
                  <span className="text-emerald-400">28°</span>
                </div>
                <div className="flex justify-between text-slate-400 py-1">
                  <span>手肘引臂高度</span>
                  <span className="text-amber-400">肩平齊 -10°</span>
                  <span className="text-emerald-400">肩上方 +15°</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'physio' && (
            <div className="space-y-3">
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-2">
                <h3 className="text-xs font-semibold text-red-400 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4" /> 落地受傷預警
                </h3>
                <p className="text-xs text-red-200 bg-red-500/10 p-2.5 rounded-xl border border-red-500/20">
                  🚨 80% 扣球偏向單腳落地，且膝蓋有內扣傾向，請留意左膝髕骨肌腱負擔。
                </p>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-2">
                <h3 className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                  <Dumbbell className="w-4 h-4" /> 防護員強化菜單
                </h3>
                <div className="text-xs space-y-1.5 text-slate-300">
                  <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">1. 箱跳落地平衡 3 組 x 10 次</div>
                  <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">2. 彈力帶肩袖外旋 4 組 x 12 次</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}