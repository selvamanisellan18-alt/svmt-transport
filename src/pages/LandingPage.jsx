import React, { useState, useEffect } from 'react';
import { Truck, Plane, Ship, Globe, Search, ArrowRight, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';

export default function LandingPage({ onNavigate }) {
  const [trackId, setTrackId] = useState('');
  const [activeService, setActiveService] = useState('road');
  const [trackingResult, setTrackingResult] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    { src: '/trucks.png', alt: 'SVAT Fleet' },
    { src: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=1200&auto=format&fit=crop', alt: 'Modern Container Trucks on the Road' },
    { src: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200&auto=format&fit=crop', alt: 'Warehouse Distribution Cargo' },
    { src: 'https://images.unsplash.com/photo-1592838064805-71bcdb4f8a0c?q=80&w=1200&auto=format&fit=crop', alt: 'Modern Freight Cargo Truck Full View' },
    { src: 'https://images.unsplash.com/photo-1501526029524-a8ea952b15be?q=80&w=1200&auto=format&fit=crop', alt: 'Full View Shipping Container Truck' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

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

        {/* Trucks Banner Box - Overhauled as dynamic glassmorphism slider */}
        <div className="hero-banner-container">
          <div className="slider-wrapper">
            {slides.map((slide, idx) => (
              <img 
                key={idx}
                src={slide.src} 
                alt={slide.alt} 
                className={`slide-img ${idx === currentSlide ? 'active' : ''}`}
              />
            ))}
            
            {/* Blurry feathered border overlays to give a smooth edge blur */}
            <div className="slider-feather-left"></div>
            <div className="slider-feather-right"></div>

            {/* Slide Arrows */}
            <button className="slider-btn prev" onClick={prevSlide} aria-label="Previous Slide">
              <ChevronLeft size={20} />
            </button>
            <button className="slider-btn next" onClick={nextSlide} aria-label="Next Slide">
              <ChevronRight size={20} />
            </button>

            {/* Slider Dots */}
            <div className="slider-dots">
              {slides.map((_, idx) => (
                <div 
                  key={idx}
                  className={`slider-dot ${idx === currentSlide ? 'active' : ''}`}
                  onClick={() => setCurrentSlide(idx)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Spacing for overlapping hero content */}
      <div className="hero-spacer"></div>

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
                <div className="step-text-container">
                  <div className="step-title">{step.title}</div>
                  <div className="step-desc">{step.desc}</div>
                </div>
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
