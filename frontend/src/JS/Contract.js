import React, { useState } from 'react';
import '../CSS/Contract.css';
import Structure from './Structure';
import { FaBuilding, FaFileContract, FaClipboardList, FaMapMarkerAlt, FaShieldAlt, FaTools, FaUsers, FaMoneyBillWave, FaLeaf } from 'react-icons/fa';

const FormSection = ({ title, icon, children }) => (
    <div className="form-section">
        <div className="section-header">
            {icon}
            <h2>{title}</h2>
        </div>
        <div className="section-content">
            {children}
        </div>
    </div>
);

const Contract = () => {
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [formData, setFormData] = useState({
        CollectionName: '',
        // Basic Information
        projectName: '',
        projectLocation: '',
        startDate: '',
        completionDate: '',
        constructionType: '',
        architectName: '',
        contractorName: '',
        ownerName: '',

        // Permit and Approval
        permitNumber: '',
        zoningClass: '',
        approvalDate: '',
        approvingAuthority: '',

        // Site Details
        plotSize: '',
        siteAddress: '',
        accessibility: '',
        existingStructures: '',

        // Construction Specifications
        floors: '',
        builtUpArea: '',
        cementName: '',
        cementQty: '',
        steelGrade: '',
        steelQty: '',
        bricksType: '',
        bricksQty: '',
        foundationType: '',
        roofType: '',

        // Workforce Details
        supervisorName: '',
        workersCount: '',

        // Cost and Budget
        estimatedBudget: '',
        fundSource: '',
        paymentSchedule: '',

        // Safety and Compliance
        insurance: '',
        safetyProtocol: '',
        emergencyContact: '',

        // Additional Features
        plumbingElectrical: '',
        greenFeatures: '',
        energyRequirements: '',
        wasteManagement: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const groupedData = {
            CollectionName: formData.CollectionName,
            basicInformation: {
                projectName: formData.projectName,
                projectLocation: formData.projectLocation,
                startDate: formData.startDate,
                completionDate: formData.completionDate,
                constructionType: formData.constructionType,
                architectName: formData.architectName,
                contractorName: formData.contractorName,
                ownerName: formData.ownerName,
            },
            permitAndApproval: {
                permitNumber: formData.permitNumber,
                zoningClass: formData.zoningClass,
                approvalDate: formData.approvalDate,
                approvingAuthority: formData.approvingAuthority,
            },
            siteDetails: {
                plotSize: formData.plotSize,
                siteAddress: formData.siteAddress,
                accessibility: formData.accessibility,
                existingStructures: formData.existingStructures,
            },
            constructionSpecifications: {
                floors: formData.floors,
                builtUpArea: formData.builtUpArea,
                materials: {
                    cementName: formData.cementName,
                    cementQty: formData.cementQty,
                    steelGrade: formData.steelGrade,
                    steelQty: formData.steelQty,
                    bricksType: formData.bricksType,
                    bricksQty: formData.bricksQty,
                },
                foundationType: formData.foundationType,
                roofType: formData.roofType,
            },
            workforceDetails: {
                supervisorName: formData.supervisorName,
                workersCount: formData.workersCount,
            },
            costAndBudget: {
                estimatedBudget: formData.estimatedBudget,
                fundSource: formData.fundSource,
                paymentSchedule: formData.paymentSchedule,
            },
            safetyAndCompliance: {
                insurance: formData.insurance,
                safetyProtocol: formData.safetyProtocol,
                emergencyContact: formData.emergencyContact,
            },
            additionalFeatures: {
                plumbingElectrical: formData.plumbingElectrical,
                greenFeatures: formData.greenFeatures,
                energyRequirements: formData.energyRequirements,
                wasteManagement: formData.wasteManagement,
            },
        };
    
        try {
            const response = await fetch('https://onsiteiq-server.onrender.com/submit-project', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(groupedData),
            });
    
            if (response.ok) {
                const result = await response.json();
                console.log('Project submitted successfully:', result);
                // Show popup for 5 seconds
                setIsPopupVisible(true);
                setTimeout(() => setIsPopupVisible(false), 5000);
                // Clear the form fields by resetting the formData
            setFormData({
                CollectionName: '',
                projectName: '',
                projectLocation: '',
                startDate: '',
                completionDate: '',
                constructionType: '',
                architectName: '',
                contractorName: '',
                ownerName: '',
                permitNumber: '',
                zoningClass: '',
                approvalDate: '',
                approvingAuthority: '',
                plotSize: '',
                siteAddress: '',
                accessibility: '',
                existingStructures: '',
                floors: '',
                builtUpArea: '',
                cementName: '',
                cementQty: '',
                steelGrade: '',
                steelQty: '',
                bricksType: '',
                bricksQty: '',
                foundationType: '',
                roofType: '',
                supervisorName: '',
                workersCount: '',
                estimatedBudget: '',
                fundSource: '',
                paymentSchedule: '',
                insurance: '',
                safetyProtocol: '',
                emergencyContact: '',
                plumbingElectrical: '',
                greenFeatures: '',
                energyRequirements: '',
                wasteManagement: '',
            });
            } else {
                console.error('Failed to submit project data');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    

    return (
        <div className="contract-container">
            <div>
            <Structure />
            </div>
            
            <div className="contract-content">
                <div className="contract-header">
                    <FaFileContract className="contract-icon" />
                    <h1>Construction Project Details</h1>
                    <div style={{marginLeft: '80px'}}>
                            <label style={{color: 'white', fontWeight: 'bold',fontSize: '20px'}}>Contract/Site ID </label>
                            <input type="text" name="CollectionName" style={{border: '2px solid white', color: 'black', fontWeight: 'bold',fontSize: '20px',color: 'white'}} 
                            value={formData.CollectionName} onChange={handleInputChange} required 
                            placeholder='Enter Contract/Site ID'/>
                    </div>
                </div>

                <form className="contract-form" onSubmit={handleSubmit}>
                    <FormSection title="Basic Information" icon={<FaBuilding />}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Project Name</label>
                                <input type="text" name="projectName" value={formData.projectName} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label>Project Location</label>
                                <input type="text" name="projectLocation" value={formData.projectLocation} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label>Start Date</label>
                                <input type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label>Completion Date</label>
                                <input type="date" name="completionDate" value={formData.completionDate} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label>Construction Type</label>
                                <input type="text" name="constructionType" value={formData.constructionType} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label>Architect Name</label>
                                <input type="text" name="architectName" value={formData.architectName} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label>Contractor Name</label>
                                <input type="text" name="contractorName" value={formData.contractorName} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label>Owner Name</label>
                                <input type="text" name="ownerName" value={formData.ownerName} onChange={handleInputChange} required />
                            </div>
                        </div>
                    </FormSection>

                    <FormSection title="Permit and Approval" icon={<FaClipboardList />}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Permit Number</label>
                                <input type="text" name="permitNumber" value={formData.permitNumber} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label>Zoning Classification</label>
                                <input type="text" name="zoningClass" value={formData.zoningClass} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label>Approval Date</label>
                                <input type="date" name="approvalDate" value={formData.approvalDate} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label>Approving Authority</label>
                                <input type="text" name="approvingAuthority" value={formData.approvingAuthority} onChange={handleInputChange} required />
                            </div>
                        </div>
                    </FormSection>

                    <FormSection title="Site Details" icon={<FaMapMarkerAlt />}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Plot Size (sq. ft)</label>
                                <input type="number" name="plotSize" value={formData.plotSize} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label>Site Address</label>
                                <input type="text" name="siteAddress" value={formData.siteAddress} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group-full-width">
                                <label>Site Accessibility Details</label>
                                <textarea name="accessibility" value={formData.accessibility} onChange={handleInputChange} rows="3" required />
                            </div>
                            <div className="form-group-full-width">
                                <label>Existing Structures</label>
                                <textarea name="existingStructures" value={formData.existingStructures} onChange={handleInputChange} rows="3" required />
                            </div>
                        </div>
                    </FormSection>

                    <FormSection title="Construction Specifications" icon={<FaTools />}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Number of Floors</label>
                                <input type="number" name="floors" value={formData.floors} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label>Built-up Area (sq. ft)</label>
                                <input type="number" name="builtUpArea" value={formData.builtUpArea} onChange={handleInputChange} required />
                            </div>
                        </div>

                        <h3>Material Requirements</h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Cement Name</label>
                                <input type="text" name="cementName" value={formData.cementName} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label>Cement Quantity</label>
                                <input type="number" name="cementQty" value={formData.cementQty} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label>Steel Grade</label>
                                <input type="text" name="steelGrade" value={formData.steelGrade} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label>Steel Quantity</label>
                                <input type="number" name="steelQty" value={formData.steelQty} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label>Bricks Type</label>
                                <input type="text" name="bricksType" value={formData.bricksType} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label>Blocks Needed</label>
                                <input type="number" name="bricksQty" value={formData.bricksQty} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label>Foundation Type</label>
                                <input type="text" name="foundationType" value={formData.foundationType} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label>Roof Type</label>
                                <input type="text" name="roofType" value={formData.roofType} onChange={handleInputChange} required />
                            </div>
                        </div>
                    </FormSection>

                    <FormSection title="Workforce Details" icon={<FaUsers />}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Site Supervisor Name</label>
                                <input type="text" name="supervisorName" value={formData.supervisorName} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label>Number of Workers</label>
                                <input type="number" name="workersCount" value={formData.workersCount} onChange={handleInputChange} required />
                            </div>
                        </div>
                    </FormSection>

                    <FormSection title="Cost and Budget" icon={<FaMoneyBillWave />}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Estimated Budget</label>
                                <input type="number" name="estimatedBudget" value={formData.estimatedBudget} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label>Fund Source</label>
                                <input type="text" name="fundSource" value={formData.fundSource} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group-full-width">
                                <label>Payment Schedule</label>
                                <textarea name="paymentSchedule" value={formData.paymentSchedule} onChange={handleInputChange} rows="3" required />
                            </div>
                        </div>
                    </FormSection>

                    <FormSection title="Safety and Compliance" icon={<FaShieldAlt />}>
                        <div className="form-grid">
                            <div className="form-group-full-width">
                                <label>Insurance Details</label>
                                <textarea name="insurance" value={formData.insurance} onChange={handleInputChange} rows="3" required />
                            </div>
                            <div className="form-group-full-width">
                                <label>Safety Protocol</label>
                                <textarea name="safetyProtocol" value={formData.safetyProtocol} onChange={handleInputChange} rows="3" required />
                            </div>
                            <div className="form-group">
                                <label>Emergency Contact Numbers</label>
                                <input type="text" name="emergencyContact" value={formData.emergencyContact} onChange={handleInputChange} required />
                            </div>
                        </div>
                    </FormSection>

                    <FormSection title="Additional Features" icon={<FaLeaf />}>
                        <div className="form-grid">
                            <div className="form-group-full-width">
                                <label>Plumbing and Electrical Plans</label>
                                <textarea name="plumbingElectrical" value={formData.plumbingElectrical} onChange={handleInputChange} rows="3" required />
                            </div>
                            <div className="form-group-full-width">
                                <label>Green Building Features</label>
                                <textarea name="greenFeatures" value={formData.greenFeatures} onChange={handleInputChange} rows="3" required />
                            </div>
                            <div className="form-group-full-width">
                                <label>Energy Requirements</label>
                                <textarea name="energyRequirements" value={formData.energyRequirements} onChange={handleInputChange} rows="3" required />
                            </div>
                            <div className="form-group-full-width">
                                <label>Waste Management Plan</label>
                                <textarea name="wasteManagement" value={formData.wasteManagement} onChange={handleInputChange} rows="3" required />
                            </div>
                        </div>
                    </FormSection>

                    <div className="button-group">
                        <button type="submit" className="submit-btn-Cont">Submit Project Details</button>
                        <button type="button" className="cancel-btn-Cont">Cancel</button>
                    </div>
                </form>
            </div>
            {/* Popup Component */}
            {isPopupVisible && (
                <div style={popupOverlayStyle}>
                    <div style={popupStyle}>
                        <h3>Success!</h3>
                        <p>Project submitted successfully.</p>
                    </div>
                </div>
            )}
        </div>
    );
};
const popupOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    color: 'green',
};

const popupStyle = {
    background: 'rgba(217, 217, 217, 0.50)',
    backdropFilter: 'blur(12.5px)',
    fontSize: '24px',
    border: '4px solid green',
    color:'green',
    padding: '30px',
    width: '400px',
    height: '150px',
    borderRadius: '10px',
    textAlign: 'center',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
};

export default Contract;
