import React, { useState, useEffect } from 'react';

const MinimalBathApp = () => {
  const familyMembers = ['お父さん', 'お母さん', 'カイ', 'ササ'];
  
  // 現在の日付を取得する関数
  const getCurrentDate = () => {
    const now = new Date();
    const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
    const weekday = weekdays[now.getDay()];
    return {
      date: `${now.getFullYear()}年${(now.getMonth() + 1).toString().padStart(2, '0')}月${now.getDate().toString().padStart(2, '0')}日（${weekday}）`,
      weekday: weekday
    };
  };
  
  // 状態管理
  const [currentDate, setCurrentDate] = useState(getCurrentDate());
  const [checks, setChecks] = useState(familyMembers.reduce((acc, member) => ({...acc, [member]: false}), {}));
  const [memo, setMemo] = useState('');
  
  // 曜日ごとの当番
  const dutySchedule = {
    '月': 'カイ', '火': 'ササ', '水': 'ササ', '木': 'ササ',
    '金': 'カイ', '土': 'カイ', '日': 'ササ'
  };
  
  // チェック状態を評価
  const checkedCount = Object.values(checks).filter(c => c).length;
  const allChecked = checkedCount === familyMembers.length;
  const isLastPerson = checkedCount === familyMembers.length - 1;
  const noOneChecked = checkedCount === 0;
  
  // 午前3時にリセットする
  useEffect(() => {
    const resetData = () => {
      const newDate = getCurrentDate();
      if (newDate.date !== currentDate.date) {
        setCurrentDate(newDate);
        setChecks(familyMembers.reduce((acc, member) => ({...acc, [member]: false}), {}));
        setMemo('');
      }
    };
    
    // 初回チェック
    resetData();
    
    // 次の午前3時までの時間を計算
    const now = new Date();
    const resetTime = new Date();
    resetTime.setHours(3, 0, 0, 0);
    
    // すでに3時を過ぎていたら翌日の3時に設定
    if (now.getHours() >= 3) {
      resetTime.setDate(resetTime.getDate() + 1);
    }
    
    const timeUntilReset = resetTime - now;
    
    // タイマーセット
    const timer = setTimeout(() => {
      resetData();
      // 以降は24時間ごとにリセット
      const dailyTimer = setInterval(resetData, 24 * 60 * 60 * 1000);
      return () => clearInterval(dailyTimer);
    }, timeUntilReset);
    
    return () => clearTimeout(timer);
  }, [currentDate]);
  
  // ステータスメッセージとスタイルを取得
  const getStatusInfo = () => {
    if (allChecked) {
      return {
        message: '全員お風呂に入りました！',
        style: 'bg-green-100 border-green-300'
      };
    } else if (isLastPerson) {
      return {
        message: 'あなたが最後です。お湯を抜いてください。',
        style: 'bg-yellow-100 border-yellow-300'
      };
    } else if (noOneChecked) {
      return {
        message: 'まだ誰もお風呂入っていません',
        style: 'bg-gray-100 border-gray-300'
      };
    } else {
      return {
        message: 'まだお風呂入っていない家族がいます',
        style: 'bg-blue-100 border-blue-300'
      };
    }
  };
  
  const { message, style } = getStatusInfo();
  
  return (
    <div className="p-4 max-w-md mx-auto bg-blue-50">
      <div className="bg-blue-600 text-white p-4 rounded-t-lg">
        <h1 className="text-xl text-center font-bold">お風呂掲示板</h1>
        <p className="text-center text-sm">{currentDate.date}</p>
        <p className="text-center text-sm mt-1">
          今日の風呂掃除当番: <span className="font-bold">{dutySchedule[currentDate.weekday]}</span>
        </p>
      </div>
      
      <div className="bg-white p-4 rounded-b-lg shadow">
        {/* ステータス表示 */}
        <div className={`p-3 rounded mb-4 border ${style}`}>
          <p className="font-medium">{message}</p>
        </div>
        
        {/* お風呂チェック */}
        <div className="mb-4 p-3 border rounded bg-gray-50">
          <p className="font-medium mb-2">お風呂チェック</p>
          {familyMembers.map(member => (
            <div 
              key={member} 
              className="flex items-center justify-between p-2 mb-2 border rounded cursor-pointer"
              style={{ 
                backgroundColor: checks[member] ? '#d1fae5' : 'white',
                borderColor: checks[member] ? '#10b981' : '#e5e7eb'
              }}
              onClick={() => setChecks({...checks, [member]: !checks[member]})}
            >
              <span>{member}</span>
              <span className="h-6 w-6 flex items-center justify-center border rounded-full" 
                style={{ backgroundColor: checks[member] ? '#10b981' : 'white', color: 'white' }}>
                {checks[member] && '✓'}
              </span>
            </div>
          ))}
        </div>
        
        {/* メモ */}
        <div className="p-3 border rounded bg-gray-50">
          <p className="font-medium mb-2">一言メモ</p>
          <textarea
            className="w-full p-2 border rounded text-sm"
            rows={2}
            placeholder="メモを記入してください..."
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
          />
          {memo && (
            <div className="mt-2 p-2 bg-yellow-50 rounded text-sm border-l-2 border-yellow-300">
              「{memo}」
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
