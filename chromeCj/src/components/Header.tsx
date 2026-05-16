import { Calendar, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [copied, setCopied] = useState(false);

  const handleCopyWechat = () => {
    navigator.clipboard.writeText('weiyimbw').then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Calendar className="w-8 h-8" />
          <div>
            <h1 className="text-xl font-bold">每日计划器</h1>
            <p className="text-sm text-blue-100 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              保持组织有序
            </p>
          </div>
        </div>
        <div className="text-right text-xs text-blue-100">
          <div>v1.0.1 | <a href="https://actnow.top" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">官网</a></div>
          <div
            onClick={handleCopyWechat}
            className="cursor-pointer hover:text-white transition-colors"
            title="点击复制微信号"
          >
            作者微信: {copied ? '已复制' : 'weiyimbw'}
          </div>
        </div>
      </div>
    </div>
  );
}
