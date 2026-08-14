import { Icon } from './Icons';

export function PhoneScene() {
  return (
    <div className="phone-stage" aria-label="Illustration of a live remote apartment viewing">
      <div className="orbit orbit-one" />
      <div className="orbit orbit-two" />
      <div className="phone-shadow" />
      <div className="phone-wrap">
        <div className="phone">
          <div className="phone-screen">
            <div className="dynamic-island" />
            <div className="room">
              <div className="room-wall" />
              <div className="window"><span /><span /></div>
              <div className="pendant"><span /></div>
              <div className="picture" />
              <div className="table"><span className="table-top" /><span className="leg l1" /><span className="leg l2" /></div>
              <div className="chair chair-a" />
              <div className="chair chair-b" />
              <div className="plant"><span className="pot" /><i /><i /><i /></div>
              <div className="floor-lines" />
            </div>
            <div className="live-badge"><span /> LIVE · MADRID</div>
            <div className="caller"><div className="caller-avatar">ST</div><span>Your local</span></div>
            <div className="call-controls">
              <button aria-label="Toggle video"><Icon name="video" /></button>
              <button aria-label="Toggle microphone" className="mic">●</button>
              <button aria-label="End call" className="end">⌕</button>
            </div>
            <div className="home-indicator" />
          </div>
        </div>
      </div>
      <div className="mini-card mini-card-a"><span className="mini-icon"><Icon name="shield" /></span><div><b>Trusted local</b><small>on the ground</small></div></div>
      <div className="mini-card mini-card-b"><span className="mini-icon"><Icon name="chat" /></span><div><b>Ask live</b><small>in real time</small></div></div>
    </div>
  );
}
