export const CSS_BLOCKS = [
  `.hero-section {
  position: relative;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 800px;
  padding: 0 2rem;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  animation: fadeInUp 1s ease-out;
}

.hero-subtitle {
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  animation: fadeInUp 1s ease-out 0.2s both;
}`,

  `.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;
}

.card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.card-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.card:hover .card-image {
  transform: scale(1.05);
}

.card-content {
  padding: 1.5rem;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
}

.card-description {
  color: #666;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.card-button {
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.card-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}`,

  `.navigation {

  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  z-index: 1000;
  transition: all 0.3s ease;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
}

.nav-logo {
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  text-decoration: none;
}

.nav-menu {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 2rem;
}

.nav-item {
  position: relative;
}

.nav-link {
  color: #333;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 0;
  transition: color 0.3s ease;
  position: relative;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(45deg, #667eea, #764ba2);
  transition: width 0.3s ease;
}

.nav-link:hover::after,
.nav-link.active::after {
  width: 100%;
}

.mobile-toggle {
  display: none;
  flex-direction: column;
  cursor: pointer;
  padding: 0.5rem;
}

.mobile-toggle span {
  width: 25px;
  height: 3px;
  background: #333;
  margin: 2px 0;
  transition: 0.3s;
}

@media (max-width: 768px) {
  .nav-menu {
    position: fixed;
    top: 100%;
    left: 0;
    width: 100%;
    background: white;
    flex-direction: column;
    padding: 2rem;
    transform: translateY(-100%);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
  }

  .nav-menu.active {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
  }

  .mobile-toggle {
    display: flex;
  }
}`,

  `.form-container {

  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1.5rem;
  position: relative;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.form-input,
.form-textarea,
.form-select {
  width: 100%;
  padding: 1rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #f8f9fa;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input.error {
  border-color: #dc3545;
  background: #fff5f5;
}

.form-error {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.form-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.form-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.form-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.form-button:hover::before {
  left: 100%;
}`,

  `.loading-spinner {

  display: inline-block;
  width: 50px;
  height: 50px;
  border: 4px solid rgba(102, 126, 234, 0.3);
  border-left: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.pulse-loader {
  display: inline-block;
  width: 60px;
  height: 60px;
  position: relative;
}

.pulse-loader::before,
.pulse-loader::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: rgba(102, 126, 234, 0.6);
  animation: pulse 2s ease-in-out infinite;
}

.pulse-loader::after {
  animation-delay: 1s;
}

@keyframes pulse {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
}

.skeleton-loader {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.dot-loader {
  display: flex;
  gap: 4px;
}

.dot-loader span {
  width: 8px;
  height: 8px;
  background: #667eea;
  border-radius: 50%;
  animation: bounce 1.4s ease-in-out infinite both;
}

.dot-loader span:nth-child(1) { animation-delay: -0.32s; }
.dot-loader span:nth-child(2) { animation-delay: -0.16s; }

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}`,

  `.modal-overlay {

  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.modal-overlay.active {
  opacity: 1;
  visibility: visible;
}

.modal {
  background: white;
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  transform: scale(0.7) translateY(-50px);
  transition: all 0.3s ease;
}

.modal-overlay.active .modal {
  transform: scale(1) translateY(0);
}

.modal-header {
  padding: 1.5rem 2rem 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e1e5e9;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  color: #666;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.modal-close:hover {
  background: #f8f9fa;
  color: #333;
}

.modal-body {
  padding: 2rem;
}

.modal-footer {
  padding: 0 2rem 2rem 2rem;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  border-top: 1px solid #e1e5e9;
}

.modal-button {
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.modal-button-primary {
  background: #667eea;
  color: white;
}

.modal-button-secondary {
  background: #f8f9fa;
  color: #333;
  border: 1px solid #e1e5e9;
}

.modal-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}`,

  `.tabs-container {

  width: 100%;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.tabs-header {
  display: flex;
  background: #f8f9fa;
  border-bottom: 1px solid #e1e5e9;
  position: relative;
}

.tab-button {
  background: none;
  border: none;
  padding: 1rem 1.5rem;
  cursor: pointer;
  font-size: 1rem;
  color: #666;
  transition: all 0.3s ease;
  position: relative;
  flex: 1;
}

.tab-button:hover {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
}

.tab-button.active {
  color: #667eea;
  background: white;
}

.tab-button.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: #667eea;
}

.tabs-content {
  padding: 2rem;
  min-height: 300px;
}

.tab-panel {
  display: none;
  animation: fadeIn 0.3s ease-in-out;
}

.tab-panel.active {
  display: block;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.vertical-tabs {
  display: flex;
  min-height: 400px;
}

.vertical-tabs .tabs-header {
  flex-direction: column;
  width: 200px;
  border-right: 1px solid #e1e5e9;
  border-bottom: none;
}

.vertical-tabs .tab-button {
  text-align: left;
  border-bottom: 1px solid #e1e5e9;
}

.vertical-tabs .tab-button:last-child {
  border-bottom: none;
}

.vertical-tabs .tab-button.active::after {
  top: 0;
  bottom: 0;
  left: auto;
  right: 0;
  width: 2px;
  height: auto;
}

.vertical-tabs .tabs-content {
  flex: 1;
}`,

  `.accordion {

  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.accordion-item {
  border-bottom: 1px solid #e1e5e9;
}

.accordion-item:last-child {
  border-bottom: none;
}

.accordion-header {
  background: #f8f9fa;
  border: none;
  width: 100%;
  padding: 1rem 1.5rem;
  text-align: left;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1rem;
  font-weight: 500;
  color: #333;
  transition: all 0.3s ease;
}

.accordion-header:hover {
  background: #e9ecef;
}

.accordion-header.active {
  background: #667eea;
  color: white;
}

.accordion-icon {
  transition: transform 0.3s ease;
  font-size: 0.875rem;
}

.accordion-header.active .accordion-icon {
  transform: rotate(180deg);
}

.accordion-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.accordion-content.active {
  max-height: 500px;
}

.accordion-body {
  padding: 1.5rem;
  color: #666;
  line-height: 1.6;
}

.accordion-flush .accordion-item {
  background: transparent;
  border: none;
  border-bottom: 1px solid #e1e5e9;
}

.accordion-flush .accordion-header {
  background: transparent;
  padding-left: 0;
  padding-right: 0;
}

.accordion-flush .accordion-header:hover {
  background: rgba(102, 126, 234, 0.05);
}`,

  `.tooltip {

  position: relative;
  display: inline-block;
  cursor: help;
}

.tooltip-content {
  position: absolute;
  background: #333;
  color: white;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  font-size: 0.875rem;
  white-space: nowrap;
  z-index: 9999;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  pointer-events: none;
}

.tooltip:hover .tooltip-content {
  opacity: 1;
  visibility: visible;
}

.tooltip-top .tooltip-content {
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(-5px);
  margin-bottom: 5px;
}

.tooltip-top:hover .tooltip-content {
  transform: translateX(-50%) translateY(0);
}

.tooltip-bottom .tooltip-content {
  top: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(5px);
  margin-top: 5px;
}

.tooltip-bottom:hover .tooltip-content {
  transform: translateX(-50%) translateY(0);
}

.tooltip-left .tooltip-content {
  right: 100%;
  top: 50%;
  transform: translateY(-50%) translateX(-5px);
  margin-right: 5px;
}

.tooltip-left:hover .tooltip-content {
  transform: translateY(-50%) translateX(0);
}

.tooltip-right .tooltip-content {
  left: 100%;
  top: 50%;
  transform: translateY(-50%) translateX(5px);
  margin-left: 5px;
}

.tooltip-right:hover .tooltip-content {
  transform: translateY(-50%) translateX(0);
}

.tooltip-content::after {
  content: '';
  position: absolute;
  width: 0;
  height: 0;
  border-style: solid;
}

.tooltip-top .tooltip-content::after {
  top: 100%;
  left: 50%;
  margin-left: -4px;
  border-width: 4px 4px 0 4px;
  border-color: #333 transparent transparent transparent;
}

.tooltip-bottom .tooltip-content::after {
  bottom: 100%;
  left: 50%;
  margin-left: -4px;
  border-width: 0 4px 4px 4px;
  border-color: transparent transparent #333 transparent;
}

.tooltip-left .tooltip-content::after {
  left: 100%;
  top: 50%;
  margin-top: -4px;
  border-width: 4px 0 4px 4px;
  border-color: transparent transparent transparent #333;
}

.tooltip-right .tooltip-content::after {
  right: 100%;
  top: 50%;
  margin-top: -4px;
  border-width: 4px 4px 4px 0;
  border-color: transparent #333 transparent transparent;
}`,

  `.slideshow-container {

  position: relative;
  max-width: 100%;
  margin: auto;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.slide {
  display: none;
  position: relative;
  width: 100%;
  height: 400px;
}

.slide.active {
  display: block;
  animation: slideIn 0.5s ease-in-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.slide-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  color: white;
  padding: 2rem;
}

.slide-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.slide-description {
  font-size: 1rem;
  opacity: 0.9;
}

.slideshow-controls {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 0.75rem;
  cursor: pointer;
  font-size: 1.5rem;
  transition: all 0.3s ease;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.slideshow-controls:hover {
  background: rgba(0, 0, 0, 0.8);
  transform: translateY(-50%) scale(1.1);
}

.prev-btn {
  left: 1rem;
}

.next-btn {
  right: 1rem;
}

.slideshow-indicators {
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.5rem;
}

.indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator.active,
.indicator:hover {
  background: white;
  transform: scale(1.2);
}`,

  `.progress-bar {

  width: 100%;
  height: 8px;
  background: #e1e5e9;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 4px;
  transition: width 0.3s ease;
  position: relative;
}

.progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.progress-circular {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: conic-gradient(#667eea 0deg, #e1e5e9 0deg);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.progress-circular::before {
  content: '';
  position: absolute;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: white;
}

.progress-text {
  position: relative;
  z-index: 1;
  font-weight: 600;
  color: #333;
}

.progress-steps {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 2rem 0;
  position: relative;
}

.progress-steps::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 2px;
  background: #e1e5e9;
  z-index: 1;
}

.step {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #e1e5e9;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: #666;
  position: relative;
  z-index: 2;
  transition: all 0.3s ease;
}

.step.active {
  background: #667eea;
  color: white;
}

.step.completed {
  background: #28a745;
  color: white;
}

.step.completed::after {
  content: '✓';
}`,

  `.breadcrumb {

  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 0;
  font-size: 0.875rem;
  color: #666;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.breadcrumb-item a {
  color: #667eea;
  text-decoration: none;
  transition: color 0.3s ease;
}

.breadcrumb-item a:hover {
  color: #764ba2;
  text-decoration: underline;
}

.breadcrumb-item.active {
  color: #333;
  font-weight: 500;
}

.breadcrumb-separator {
  color: #999;
}

.breadcrumb-separator::after {
  content: '/';
}

.badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 4px;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
}

.badge-primary {
  background: #667eea;
  color: white;
}

.badge-secondary {
  background: #6c757d;
  color: white;
}

.badge-success {
  background: #28a745;
  color: white;
}

.badge-danger {
  background: #dc3545;
  color: white;
}

.badge-warning {
  background: #ffc107;
  color: #212529;
}

.badge-info {
  background: #17a2b8;
  color: white;
}

.badge-light {
  background: #f8f9fa;
  color: #495057;
  border: 1px solid #dee2e6;
}

.badge-dark {
  background: #343a40;
  color: white;
}

.alert {
  padding: 1rem 1.5rem;
  border-radius: 8px;
  border: 1px solid transparent;
  margin-bottom: 1rem;
  position: relative;
}

.alert-success {
  background: #d4edda;
  border-color: #c3e6cb;
  color: #155724;
}

.alert-danger {
  background: #f8d7da;
  border-color: #f5c6cb;
  color: #721c24;
}

.alert-warning {
  background: #fff3cd;
  border-color: #ffeaa7;
  color: #856404;
}

.alert-info {
  background: #cce7f0;
  border-color: #bee5eb;
  color: #0c5460;
}

.alert-dismissible {
  padding-right: 4rem;
}

.alert-close {
  position: absolute;
  top: 0.5rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.3s ease;
}

.alert-close:hover {
  opacity: 1;
}`,

  `.utilities {
}

.d-flex { display: flex; }
.d-inline-flex { display: inline-flex; }
.flex-row { flex-direction: row; }
.flex-column { flex-direction: column; }
.flex-wrap { flex-wrap: wrap; }
.flex-nowrap { flex-wrap: nowrap; }

.justify-content-start { justify-content: flex-start; }
.justify-content-end { justify-content: flex-end; }
.justify-content-center { justify-content: center; }
.justify-content-between { justify-content: space-between; }
.justify-content-around { justify-content: space-around; }
.justify-content-evenly { justify-content: space-evenly; }

.align-items-start { align-items: flex-start; }
.align-items-end { align-items: flex-end; }
.align-items-center { align-items: center; }
.align-items-baseline { align-items: baseline; }
.align-items-stretch { align-items: stretch; }

.flex-grow-1 { flex-grow: 1; }
.flex-shrink-1 { flex-shrink: 1; }
.flex-fill { flex: 1 1 auto; }

.d-grid { display: grid; }
.gap-0 { gap: 0; }
.gap-1 { gap: 0.25rem; }
.gap-2 { gap: 0.5rem; }
.gap-3 { gap: 1rem; }
.gap-4 { gap: 1.5rem; }
.gap-5 { gap: 3rem; }

.text-start { text-align: left; }
.text-end { text-align: right; }
.text-center { text-align: center; }
.text-justify { text-align: justify; }

.text-lowercase { text-transform: lowercase; }
.text-uppercase { text-transform: uppercase; }
.text-capitalize { text-transform: capitalize; }

.fw-light { font-weight: 300; }
.fw-normal { font-weight: 400; }
.fw-bold { font-weight: 700; }
.fw-bolder { font-weight: 900; }

.fs-1 { font-size: 2.5rem; }
.fs-2 { font-size: 2rem; }
.fs-3 { font-size: 1.75rem; }
.fs-4 { font-size: 1.5rem; }
.fs-5 { font-size: 1.25rem; }
.fs-6 { font-size: 1rem; }

.text-primary { color: #667eea; }
.text-secondary { color: #6c757d; }
.text-success { color: #28a745; }
.text-danger { color: #dc3545; }
.text-warning { color: #ffc107; }
.text-info { color: #17a2b8; }
.text-light { color: #f8f9fa; }
.text-dark { color: #343a40; }
.text-muted { color: #6c757d; }

.bg-primary { background-color: #667eea; }
.bg-secondary { background-color: #6c757d; }
.bg-success { background-color: #28a745; }
.bg-danger { background-color: #dc3545; }
.bg-warning { background-color: #ffc107; }
.bg-info { background-color: #17a2b8; }
.bg-light { background-color: #f8f9fa; }
.bg-dark { background-color: #343a40; }

.m-0 { margin: 0; }
.m-1 { margin: 0.25rem; }
.m-2 { margin: 0.5rem; }
.m-3 { margin: 1rem; }
.m-4 { margin: 1.5rem; }
.m-5 { margin: 3rem; }

.mt-0 { margin-top: 0; }
.mt-1 { margin-top: 0.25rem; }
.mt-2 { margin-top: 0.5rem; }
.mt-3 { margin-top: 1rem; }
.mt-4 { margin-top: 1.5rem; }
.mt-5 { margin-top: 3rem; }

.mb-0 { margin-bottom: 0; }
.mb-1 { margin-bottom: 0.25rem; }
.mb-2 { margin-bottom: 0.5rem; }
.mb-3 { margin-bottom: 1rem; }
.mb-4 { margin-bottom: 1.5rem; }
.mb-5 { margin-bottom: 3rem; }

.p-0 { padding: 0; }
.p-1 { padding: 0.25rem; }
.p-2 { padding: 0.5rem; }
.p-3 { padding: 1rem; }
.p-4 { padding: 1.5rem; }
.p-5 { padding: 3rem; }

.d-none { display: none; }
.d-block { display: block; }
.d-inline { display: inline; }
.d-inline-block { display: inline-block; }

.position-static { position: static; }
.position-relative { position: relative; }
.position-absolute { position: absolute; }
.position-fixed { position: fixed; }
.position-sticky { position: sticky; }

.border { border: 1px solid #dee2e6; }
.border-0 { border: 0; }
.border-top { border-top: 1px solid #dee2e6; }
.border-end { border-right: 1px solid #dee2e6; }
.border-bottom { border-bottom: 1px solid #dee2e6; }
.border-start { border-left: 1px solid #dee2e6; }

.rounded { border-radius: 0.25rem; }
.rounded-0 { border-radius: 0; }
.rounded-1 { border-radius: 0.2rem; }
.rounded-2 { border-radius: 0.25rem; }
.rounded-3 { border-radius: 0.3rem; }
.rounded-circle { border-radius: 50%; }
.rounded-pill { border-radius: 50rem; }

.shadow-none { box-shadow: none; }
.shadow-sm { box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075); }
.shadow { box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15); }
.shadow-lg { box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.175); }`,

  `.dark-theme {

  --bg-primary: #1a1a1a;
  --bg-secondary: #2d2d2d;
  --bg-accent: #3d3d3d;
  --text-primary: #ffffff;
  --text-secondary: #b3b3b3;
  --text-muted: #666666;
  --border-color: #404040;
  --accent-color: #667eea;
  --success-color: #4ade80;
  --warning-color: #fbbf24;
  --error-color: #f87171;
}

.light-theme {
  --bg-primary: #ffffff;
  --bg-secondary: #f8f9fa;
  --bg-accent: #e9ecef;
  --text-primary: #212529;
  --text-secondary: #495057;
  --text-muted: #6c757d;
  --border-color: #dee2e6;
  --accent-color: #667eea;
  --success-color: #22c55e;
  --warning-color: #f59e0b;
  --error-color: #ef4444;
}

body {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  transition: all 0.3s ease;
}

.card {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
}

.button {
  background-color: var(--accent-color);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

.button:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.input {
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
}

.input:focus {
  border-color: var(--accent-color);
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}

.text-muted {
  color: var(--text-muted);
}

.theme-toggle {
  position: fixed;
  top: 1rem;
  right: 1rem;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 1000;
}

.theme-toggle:hover {
  background: var(--accent-color);
  color: white;
}

@media (prefers-color-scheme: dark) {
  :root {
    color-scheme: dark;
  }
  
  body:not([data-theme]) {
    --bg-primary: #1a1a1a;
    --bg-secondary: #2d2d2d;
    --bg-accent: #3d3d3d;
    --text-primary: #ffffff;
    --text-secondary: #b3b3b3;
    --text-muted: #666666;
    --border-color: #404040;
  }
}`
];
