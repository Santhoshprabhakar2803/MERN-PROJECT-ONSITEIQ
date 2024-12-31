import React, { useState } from 'react';
import '../CSS/EstimationForm.css';
import Structure from './Structure';

const FormSection = ({ title, children }) => (
  <div className="form-section">
    <h2>{title}</h2>
    <div className="form-content">{children}</div>
  </div>
);

const EstimationForm = () => {
  const [formData, setFormData] = useState({
    basicInfo: {
      projectName: '',
      projectLocation: '',
      estimationDate: '',
      siteSupervisor: '',
      projectScope: '',
    },
    materialEstimation: {
      cementBags: '',
      steelTons: '',
      bricks: '',
      sand: '',
      gravel: '',
    },
    workforceEstimation: {
      laborers: '',
      specialists: '',
      manHours: '',
    },
    costEstimation: {
      materialCosts: '',
      laborCosts: '',
      equipmentCosts: '',
      contingencyFund: '',
      totalCost: '',
    },
    timelineEstimation: {
      progress: '',
      completionDate: '',
      milestones: '',
      pendingTasks: '',
    },
    equipmentAndMachinery: {
      equipmentNeeded: '',
      usageTime: '',
      rentalCost: '',
    },
    monitoringObservations: {
      materialWastage: '',
      delays: '',
      safetyCompliance: '',
      resourceUtilization: '',
    },
    additionalInfo: {
      siteConditions: '',
      weatherImpact: '',
      recommendations: '',
      notes: '',
    },
  });

  const handleInputChange = (e, section) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [section]: {
        ...prevState[section],
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Basic validation
    if (!formData.basicInfo.projectName || !formData.basicInfo.projectLocation) {
      alert('Project Name and Project Location are required!');
      return;
    }
  
    try {
      const response = await fetch('https://onsiteiq-server.onrender.com/api/estimation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectName: formData.basicInfo.projectName,
          projectLocation: formData.basicInfo.projectLocation,
          ...formData, // Include all other fields
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('Form data successfully sent:', data);
        alert('Form submitted successfully!');
      } else {
        const errorData = await response.json();
        console.error('Error submitting form data:', errorData);
        alert(`Error submitting form: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error submitting form data:', error);
      alert('Error submitting form. Please try again.');
    }
  };
  

  return (
    <div className="EstimationForm-Main">
      <Structure />
      <div className="EstimationForm-Main2">
        <h1 style={{ display: 'flex', justifyContent: 'center' }}>Estimation Form</h1>
        <form className="estimation-form" onSubmit={handleSubmit}>
          {/* Basic Information */}
          <FormSection title="Basic Information">
            <div className="input-group">
              {Object.keys(formData.basicInfo).map((key) => (
                <div className="form-control" key={key}>
                  <label>{key.replace(/([A-Z])/g, ' $1')}</label>
                  <input
                    type={key === 'estimationDate' ? 'date' : 'text'}
                    name={key}
                    value={formData.basicInfo[key]}
                    onChange={(e) => handleInputChange(e, 'basicInfo')}
                    placeholder={`Enter ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                  />
                </div>
              ))}
            </div>
          </FormSection>

          {/* Material Estimation */}
          <FormSection title="Material Estimation">
            <div className="input-group">
              {Object.keys(formData.materialEstimation).map((key) => (
                <div className="form-control" key={key}>
                  <label>{key.replace(/([A-Z])/g, ' $1')}</label>
                  <input
                    type="number"
                    name={key}
                    value={formData.materialEstimation[key]}
                    onChange={(e) => handleInputChange(e, 'materialEstimation')}
                    placeholder={`Enter ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                  />
                </div>
              ))}
            </div>
          </FormSection>

          {/* Workforce Estimation */}
          <FormSection title="Workforce Estimation">
            <div className="input-group">
              {Object.keys(formData.workforceEstimation).map((key) => (
                <div className="form-control" key={key}>
                  <label>{key.replace(/([A-Z])/g, ' $1')}</label>
                  <input
                    type="number"
                    name={key}
                    value={formData.workforceEstimation[key]}
                    onChange={(e) => handleInputChange(e, 'workforceEstimation')}
                    placeholder={`Enter ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                  />
                </div>
              ))}
            </div>
          </FormSection>

          {/* Cost Estimation */}
          <FormSection title="Cost Estimation">
            <div className="input-group">
              {Object.keys(formData.costEstimation).map((key) => (
                <div className="form-control" key={key}>
                  <label>{key.replace(/([A-Z])/g, ' $1')}</label>
                  <input
                    type="number"
                    name={key}
                    value={formData.costEstimation[key]}
                    onChange={(e) => handleInputChange(e, 'costEstimation')}
                    placeholder={`Enter ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                  />
                </div>
              ))}
            </div>
          </FormSection>

          {/* Timeline Estimation */}
          <FormSection title="Timeline Estimation">
            <div className="input-group">
              {Object.keys(formData.timelineEstimation).map((key) => (
                <div className="form-control" key={key}>
                  <label>{key.replace(/([A-Z])/g, ' $1')}</label>
                  <input
                    type="text"
                    name={key}
                    value={formData.timelineEstimation[key]}
                    onChange={(e) => handleInputChange(e, 'timelineEstimation')}
                    placeholder={`Enter ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                  />
                </div>
              ))}
            </div>
          </FormSection>

          {/* Equipment and Machinery */}
          <FormSection title="Equipment and Machinery">
            <div className="input-group">
              {Object.keys(formData.equipmentAndMachinery).map((key) => (
                <div className="form-control" key={key}>
                  <label>{key.replace(/([A-Z])/g, ' $1')}</label>
                  <input
                    type="text"
                    name={key}
                    value={formData.equipmentAndMachinery[key]}
                    onChange={(e) => handleInputChange(e, 'equipmentAndMachinery')}
                    placeholder={`Enter ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                  />
                </div>
              ))}
            </div>
          </FormSection>

          {/* Monitoring Observations */}
          <FormSection title="Monitoring Observations">
            <div className="input-group">
              {Object.keys(formData.monitoringObservations).map((key) => (
                <div className="form-control" key={key}>
                  <label>{key.replace(/([A-Z])/g, ' $1')}</label>
                  <input
                    type="text"
                    name={key}
                    value={formData.monitoringObservations[key]}
                    onChange={(e) => handleInputChange(e, 'monitoringObservations')}
                    placeholder={`Enter ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                  />
                </div>
              ))}
            </div>
          </FormSection>

          {/* Additional Information */}
          <FormSection title="Additional Information">
            <div className="input-group">
              {Object.keys(formData.additionalInfo).map((key) => (
                <div className="form-control" key={key}>
                  <label>{key.replace(/([A-Z])/g, ' $1')}</label>
                  <textarea
                    name={key}
                    value={formData.additionalInfo[key]}
                    onChange={(e) => handleInputChange(e, 'additionalInfo')}
                    placeholder={`Enter ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                  />
                </div>
              ))}
            </div>
          </FormSection>

          <div className="form-actions">
            <button type="submit" className="submit-btn-Est-Form">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EstimationForm;
