import React, { useState } from 'react';
import { Truck, Plane, Ship, Globe, Search, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function LandingPage({ onNavigate }) {
  const [trackId, setTrackId] = useState('');
  const [activeService, setActiveService] = useState('road');
  const [trackingResult, setTrackingResult] = useState(null);

  const handleTrack = (e) => {
    e.preventDefault();
    if (!trackId.trim()) return;

    // Simulate tracking search
    setTrackingResult({
      id: trackId,
      status: 'In Transit',
      steps: [
        { title: 'Order Booked', desc: 'Salem Hub - Jun 21', active: true },
        { title: 'In Transit', desc: 'Tirupur CFS - Jun 22', active: true },
        { title: 'Port Loading', desc: 'Nhava Sheva - Jun 23', active: true },
        { title: 'Out for Delivery', desc: 'Destination Port - Est Jun 26', active: false }
      ]
    });
  };

  const services = [
    { id: 'road', name: 'Road Freight', icon: Truck, text: 'Tailored land transport solutions across national borders.' },
    { id: 'air', name: 'Air Freight', icon: Plane, text: 'Fast, secure, and globally connected air cargo delivery.' },
    { id: 'ocean', name: 'Ocean Cargo', icon: Ship, text: 'High capacity sea shipping for containerized goods.' },
    { id: 'worldwide', name: 'World Wide', icon: Globe, text: 'Complete global door-to-door multimodal solutions.' }
  ];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <p className="hero-subtitle">Experience</p>
          <h1 className="hero-title">Connecting People.<br />Improving lives.</h1>
          <p className="hero-description">
            Your trusted global logistics partner delivering safety, efficiency, and real-time shipment monitoring across ocean, air, and land.
          </p>
          <a href="#track-widget" className="btn-primary" style={{ textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>
            Find Out More <ArrowRight size={14} />
          </a>
        </div>

        {/* Trucks Banner Box */}
        <div style={{
          maxWidth: '850px',
          margin: '4rem auto -12rem',
          backgroundColor: '#FFFFFF',
          padding: '1rem',
          borderRadius: '12px',
          border: '1.5px solid var(--border-color)',
          boxShadow: 'var(--shadow-premium)'
        }}>
          <img 
            src="/trucks.png" 
            alt="SVAT Fleet" 
            style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '8px' }} 
          />
        </div>
      </section>

      {/* Spacing for overlapping hero content */}
      <div style={{ height: '12rem' }}></div>

      {/* Shipment Tracking Widget */}
      <section id="track-widget" className="tracking-container">
        <h3 className="tracking-title">
          <Truck className="logo-icon" style={{ width: '24px', height: '24px' }} />
          TRACK YOUR SHIPMENT
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', textAlign: 'left' }}>
          Enter your shipment tracking ID to get real-time status updates on your cargo transit progress.
        </p>
        
        <form onSubmit={handleTrack} className="tracking-form">
          <input 
            type="text" 
            placeholder="Enter Track ID (e.g., TRK-98302)" 
            className="input-field"
            value={trackId}
            onChange={(e) => setTrackId(e.target.value)}
            required
          />
          <button type="submit" className="btn-primary">
            <Search size={18} />
            Track
          </button>
        </form>

        {trackingResult && (
          <div className="tracking-timeline">
            {trackingResult.steps.map((step, idx) => (
              <div key={idx} className={`timeline-step ${step.active ? 'active' : ''}`}>
                <div className="step-node"></div>
                <div className="step-title">{step.title}</div>
                <div className="step-desc">{step.desc}</div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Service Cards */}
      <section className="services-section">
        <div className="services-grid">
          {services.map((service) => {
            const Icon = service.icon;
            const isSelected = activeService === service.id;
            return (
              <div 
                key={service.id} 
                className={`service-card ${isSelected ? 'active' : ''}`}
                onClick={() => setActiveService(service.id)}
              >
                <div>
                  <Icon className="service-icon" />
                  <h4 className="service-title">{service.name}</h4>
                </div>
                <p style={{ fontSize: '0.85rem', opacity: isSelected ? 0.9 : 0.7 }}>
                  {service.text}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <div className="about-grid">
          <div className="about-img-container">
            <img src="/about.png" alt="Warehouse Staff" className="about-img" />
          </div>
          <div className="about-content">
            <p className="hero-subtitle" style={{ fontSize: '0.85rem' }}>About SVAT</p>
            <h2 className="about-title">Sree Vaarahi Amman Transports</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              We are Sree Vaarahi Amman Transports (SVAT), South-Asia's premier container supplying agency and integrated cargo movers. We have the most extensive domestic network covering key ports, hubs, and terminals, ensuring certified transport excellence.
            </p>
            <ul className="about-list">
              <li className="about-list-item">
                <CheckCircle2 className="about-list-icon" />
                <div>
                  <strong style={{ color: '#FFFFFF' }}>Detailed Fleet Planning:</strong> Customized logistics routing that fits any transportation industry size.
                </div>
              </li>
              <li className="about-list-item">
                <CheckCircle2 className="about-list-icon" />
                <div>
                  <strong style={{ color: '#FFFFFF' }}>High Security Standards:</strong> We ensure absolute care and monitoring for all containers and cargo.
                </div>
              </li>
              <li className="about-list-item">
                <CheckCircle2 className="about-list-icon" />
                <div>
                  <strong style={{ color: '#FFFFFF' }}>Multimodal Integration:</strong> Smooth transition between ocean hubs, air freight, and local road transport.
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
