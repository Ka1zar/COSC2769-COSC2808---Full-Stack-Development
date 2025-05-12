import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast'; // Assuming you are using react-hot-toast
import styles from './SystemSettingsPage.module.css'; // Import CSS module

const SystemSettingsPage = () => {
    const [settings, setSettings] = useState({
        maxActiveEvents: 5,
        maxInvitations: 100,
        defaultReminderDays: '2 days before', // Default value
        maxImageUploadSize: 5, // in MB
        autoApprovePublic: 'No', // 'Yes' or 'No'
        discussionModeration: 'Post-moderation', // 'Pre-moderation' or 'Post-moderation'
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    // --- Fetch settings from backend ---
    useEffect(() => {
        const fetchSettings = async () => {
            setLoading(true);
            setError(null);
            try {
                // Replace with your actual API endpoint to fetch settings
                const response = await axios.get('/api/admin/settings'); // Example API endpoint
                setSettings(response.data);
            } catch (err) {
                console.error('Error fetching settings:', err);
                setError('Failed to load system settings.');
                toast.error('Failed to load system settings.');
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, []); // Empty dependency array means this runs once on mount

    // --- Handle input changes ---
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSettings(prevSettings => ({
            ...prevSettings,
            [name]: value,
        }));
    };

     // --- Handle radio button changes ---
     const handleRadioChange = (e) => {
        const { name, value } = e.target;
        setSettings(prevSettings => ({
            ...prevSettings,
            [name]: value,
        }));
     };


    // --- Handle Save Settings ---
    const handleSaveSettings = async () => {
        setSaving(true);
        setError(null);
        try {
            // Replace with your actual API endpoint to save settings
            await axios.post('/api/admin/settings', settings); // Example API endpoint
            toast.success('Settings saved successfully!');
        } catch (err) {
            console.error('Error saving settings:', err);
            setError('Failed to save settings.');
            toast.error('Failed to save settings.');
        } finally {
            setSaving(false);
        }
    };

    // --- Handle Reset to Defaults ---
    const handleResetToDefaults = async () => {
        if (window.confirm('Are you sure you want to reset settings to default?')) {
            setLoading(true); // Optional: show loading while resetting
            setError(null);
            try {
                // Option 1: Fetch defaults from backend
                // Replace with your actual API endpoint to get default settings
                const response = await axios.get('/api/admin/settings/default'); // Example endpoint for defaults
                setSettings(response.data);
                toast.success('Settings reset to defaults.');

                // Option 2: Use hardcoded defaults (if you don't have a backend endpoint for defaults)
                // setSettings({
                //     maxActiveEvents: 5,
                //     maxInvitations: 100,
                //     defaultReminderDays: '2 days before',
                //     maxImageUploadSize: 5,
                //     autoApprovePublic: 'No',
                //     discussionModeration: 'Post-moderation',
                // });
                // toast.success('Settings reset to defaults (hardcoded).');

            } catch (err) {
                 console.error('Error resetting settings:', err);
                 setError('Failed to reset settings.');
                 toast.error('Failed to reset settings.');
            } finally {
                setLoading(false);
            }
        }
    };

    if (loading) {
        return <div className={styles.settingsContainer}>Loading settings...</div>;
    }

    if (error) {
        return <div className={`${styles.settingsContainer} ${styles.error}`}>{error}</div>;
    }

    return (
        <div className={styles.settingsPage}>
            <div className={styles.settingsHeader}>
                 <h1>System Settings</h1>
                 <p>Configure global parameters for the event management system</p>
            </div>


            <div className={styles.settingsForm}>
                <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                        <label htmlFor="maxActiveEvents">Maximum Active Events Per User</label>
                        <input
                            type="number"
                            id="maxActiveEvents"
                            name="maxActiveEvents"
                            value={settings.maxActiveEvents}
                            onChange={handleInputChange}
                            min="1" // Example minimum
                        />
                        <small>Limit the number of events a single user can manage simultaneously</small>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="maxInvitations">Maximum Invitations Per Event</label>
                        <input
                            type="number"
                            id="maxInvitations"
                            name="maxInvitations"
                            value={settings.maxInvitations}
                            onChange={handleInputChange}
                            min="1" // Example minimum
                        />
                        <small>Set the maximum number of people that can be invited to a single event</small>
                    </div>
                </div>

                <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                        <label htmlFor="defaultReminderDays">Default Reminder Days</label>
                        <select
                            id="defaultReminderDays"
                            name="defaultReminderDays"
                            value={settings.defaultReminderDays}
                            onChange={handleInputChange} // Use handleInputChange for select too
                        >
                            {/* Add more options as needed */}
                            <option value="0 days before">On the day</option>
                            <option value="1 day before">1 day before</option>
                            <option value="2 days before">2 days before</option>
                            <option value="3 days before">3 days before</option>
                            <option value="7 days before">7 days before</option>
                        </select>
                        <small>Default time to send reminders before events</small>
                    </div>

                     <div className={styles.formGroup}>
                        <label htmlFor="maxImageUploadSize">Maximum Image Upload Size (MB)</label>
                        <input
                            type="number"
                            id="maxImageUploadSize"
                            name="maxImageUploadSize"
                            value={settings.maxImageUploadSize}
                            onChange={handleInputChange}
                            min="1" // Example minimum
                        />
                        <small>Maximum file size for event image uploads</small>
                    </div>
                </div>

                 <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                         <label>Auto-approve Public Event Requests</label>
                         <div>
                            <label className={styles.radioLabel}>
                                 <input
                                     type="radio"
                                     name="autoApprovePublic"
                                     value="Yes"
                                     checked={settings.autoApprovePublic === 'Yes'}
                                     onChange={handleRadioChange}
                                 /> Yes
                            </label>
                            <label className={styles.radioLabel}>
                                 <input
                                     type="radio"
                                     name="autoApprovePublic"
                                     value="No"
                                     checked={settings.autoApprovePublic === 'No'}
                                     onChange={handleRadioChange}
                                 /> No
                            </label>
                         </div>
                         <small>Automatically approve requests to join public events</small>
                    </div>

                     <div className={styles.formGroup}>
                         <label>Discussion Board Moderation</label>
                         <div>
                             <label className={styles.radioLabel}>
                                 <input
                                     type="radio"
                                     name="discussionModeration"
                                     value="Pre-moderation"
                                     checked={settings.discussionModeration === 'Pre-moderation'}
                                     onChange={handleRadioChange}
                                 /> Pre-moderation
                            </label>
                             <label className={styles.radioLabel}>
                                 <input
                                     type="radio"
                                     name="discussionModeration"
                                     value="Post-moderation"
                                     checked={settings.discussionModeration === 'Post-moderation'}
                                     onChange={handleRadioChange}
                                 /> Post-moderation
                            </label>
                         </div>
                         <small>Control how discussions are moderated</small>
                    </div>
                </div>

                 <div className={styles.buttonContainer}>
                    <button
                        className={styles.resetButton}
                        onClick={handleResetToDefaults}
                        disabled={loading || saving}
                    >
                        Reset to Defaults
                    </button>
                    <button
                        className={styles.saveButton}
                        onClick={handleSaveSettings}
                        disabled={loading || saving}
                    >
                        {saving ? 'Saving...' : 'Save Settings'}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default SystemSettingsPage;