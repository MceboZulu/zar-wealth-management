// src/components/ReferralPage.js
import React, { useState, useEffect } from 'react';
import Navigation from './Navigation.js';
import './ReferralPage.css';
import { useNavigate } from 'react-router-dom';
import { Oval } from 'react-loader-spinner';

// const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_BASE_URL = 'http:192.168.68.104:2727'; 

function ReferralPage() {
    const [referralCode, setReferralCode] = useState('');
    const [referredUsers, setReferredUsers] = useState([]);
    const [referrerInfo, setReferrerInfo] = useState(null);
    const [referralRewardEarned, setReferralRewardEarned] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchReferralData = async () => {
            const token = localStorage.getItem('authToken');

            if (!token) {
                navigate('/login', { replace: true });
                setLoading(true);
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/api/referral`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setReferralCode(data.referralCode || '');
                    setReferredUsers(data.referredUsers || []);
                    setReferrerInfo(data.referrerInfo || null);
                    setReferralRewardEarned(data.referralRewardEarned || 0);
                    setLoading(false);
                } else if (response.status === 401) {
                    localStorage.removeItem('authToken');
                    setLoading(false);
                    navigate('/login', { replace: true });
                } else {
                    const errorData = await response.json();
                    setError(errorData.message || 'Failed to fetch referral data.');
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error fetching referral data:', error);
                setError('Failed to connect to the server.');
                setLoading(false);
            }
        };

        fetchReferralData();
    }, [navigate]);

    const handleCopyLink = () => {
        const referralLink = `${window.location.origin}/signup?ref=${referralCode}`;
        navigator.clipboard.writeText(referralLink)
            .then(() => alert('Referral link copied to clipboard!'))
            .catch(err => console.error('Error copying link:', err));
    };

    if (loading) {
         return (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100vh',
                }}
              >
                <Oval color="#3498db" height={80} width={80} />
              </div>
            )
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="referral-page">
            <Navigation />
            <h2>Refer and Earn</h2>
            <p>Share your unique referral link with friends and earn rewards!</p>
            <div className="referral-link-display">
                <code>{`${window.location.origin}/signup?ref=${referralCode}`}</code>
                <button onClick={handleCopyLink}>Copy Link</button>
            </div>
            <h3>Your Referrals</h3>
            {referredUsers.length > 0 ? (
                <ul>
                    {referredUsers.map(user => (
                        <li key={user.user_id}>
                            {user.first_name} {user.last_name} (Reward Status: {user.reward_status || 'Pending'})
                        </li>
                    ))}
                </ul>
            ) : (
                <p>You haven't referred any users yet.</p>
            )}
            <h3>Your Referrer</h3>
            {referrerInfo ? (
                <p>Referred by: {referrerInfo.first_name} {referrerInfo.last_name}</p>
            ) : (
                <p>You were not referred by anyone.</p>
            )}
            {referralRewardEarned > 0 && (
                <p>Referral Reward Earned: ZAR {referralRewardEarned.toFixed(2)}</p>
            )}
        </div>
    );
}

export default ReferralPage;