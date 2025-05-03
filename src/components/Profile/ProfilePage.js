import React, { useState, useEffect } from 'react';
import './ProfilePage.css';

function ProfilePage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [passportId, setPassportId] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [nationality, setNationality] = useState('');
  const [verificationStatus, setVerificationStatus] = useState('');

  const [documents, setDocuments] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [bankCards, setBankCards] = useState([]);

  const [newDocument, setNewDocument] = useState(null);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({ type: '', street: '', city: '', country: '' });
  const [isAddingPhoneNumber, setIsAddingPhoneNumber] = useState(false);
  const [newPhoneNumber, setNewPhoneNumber] = useState({ type: '', number: '' });
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardDetails, setNewCardDetails] = useState({ type: '', number: '', expiry: '', cvv: '' });

  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch('http://192.168.68.104:2727/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        setFirstName(data.firstName || '');
        setLastName(data.lastName || '');
        setEmail(data.email || '');
        setPassportId(data.passportId || '');
        setDateOfBirth(data.dateOfBirth || '');
        setGender(data.gender || '');
        setNationality(data.nationality || '');
        setVerificationStatus(data.verificationStatus || '');

        setAddresses(data.addresses || []);
        setPhoneNumbers(data.phoneNumbers || []);
        setBankCards(data.bankCards || []);
        setDocuments(data.documents || []);
      } catch (error) {
        setError('Failed to load profile data.');
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleSaveInfo = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://192.168.68.104:2727/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          passportId,
          verificationStatus,
          dateOfBirth,
          gender,
          nationality,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setIsEditingInfo(false);
    } catch (error) {
      setError('Failed to update profile.');
      console.error('Error saving profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadDocument = async () => {
    if (newDocument) {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('authToken');
        const formData = new FormData();
        formData.append('document', newDocument);
        const response = await fetch('/api/users/documents/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setDocuments([...documents, data]);
        setNewDocument(null);
      } catch (error) {
        setError('Failed to upload document.');
        console.error('Error uploading document:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSaveNewAddress = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/users/addresses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newAddress),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setAddresses([...addresses, data]);
      setNewAddress({ type: '', street: '', city: '', country: '' });
      setIsAddingAddress(false);
    } catch (error) {
      setError('Failed to add new address.');
      console.error('Error adding address:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading profile data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="profile-page">
      <h2>User Profile</h2>

      <div className="profile-info">
        <h3>Account Details</h3>

        {isEditingInfo ? (
          <>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First Name"
            />
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last Name"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
            <input
              type="text"
              value={passportId}
              onChange={(e) => setPassportId(e.target.value)}
              placeholder="Passport / ID"
            />
            <input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
            />
            <input
              type="text"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              placeholder="Gender"
            />
            <input
              type="text"
              value={nationality}
              onChange={(e) => setNationality(e.target.value)}
              placeholder="Nationality"
            />
            <input
              type="text"
              value={verificationStatus}
              onChange={(e) => setVerificationStatus(e.target.value)}
              placeholder="Verification Status"
            />
            <button onClick={handleSaveInfo}>Save</button>
            <button onClick={() => setIsEditingInfo(false)}>Cancel</button>
          </>
        ) : (
          <>
            <p><strong>Full Name:</strong> {firstName} {lastName}</p>
            <p><strong>Email:</strong> {email}</p>
            <p><strong>Passport/ID:</strong> {passportId}</p>
            <p><strong>Date of Birth:</strong> {dateOfBirth}</p>
            <p><strong>Gender:</strong> {gender}</p>
            <p><strong>Nationality:</strong> {nationality}</p>
            <p><strong>Verification Status:</strong> {verificationStatus}</p>
            <button onClick={() => setIsEditingInfo(true)}>Edit</button>
          </>
        )}
      </div>

      <div className="documents-section">
        <h3>Documents</h3>
        <ul>
          {documents.map(doc => (
            <li key={doc.id}>
              {doc.name} — {new Date(doc.upload_date).toLocaleDateString()} — Status: {doc.status}
            </li>
          ))}
        </ul>
        <input type="file" onChange={(e) => setNewDocument(e.target.files[0])} />
        <button onClick={handleUploadDocument}>Upload Document</button>
      </div>

      <div className="addresses-section">
        <h3>Addresses</h3>
        <ul>
          {addresses.map(addr => (
            <li key={addr.id}>
              {addr.type}: {addr.street}, {addr.city}, {addr.province}, {addr.country}, {addr.postal_code}
              {addr.is_primary && ' (Primary)'}
            </li>
          ))}
        </ul>
        {isAddingAddress ? (
          <>
            <input placeholder="Type" onChange={(e) => setNewAddress({ ...newAddress, type: e.target.value })} />
            <input placeholder="Street" onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })} />
            <input placeholder="City" onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} />
            <input placeholder="Country" onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })} />
            <button onClick={handleSaveNewAddress}>Save Address</button>
            <button onClick={() => setIsAddingAddress(false)}>Cancel</button>
          </>
        ) : (
          <button onClick={() => setIsAddingAddress(true)}>Add Address</button>
        )}
      </div>

      <div className="phone-section">
        <h3>Phone Numbers</h3>
        <ul>
          {phoneNumbers.map(phone => (
            <li key={phone.id}>{phone.type}: {phone.number} {phone.is_primary && '(Primary)'}</li>
          ))}
        </ul>
      </div>

      <div className="bank-cards-section">
        <h3>Bank Cards</h3>
        <ul>
          {bankCards.map(card => (
            <li key={card.id}>{card.card_type}: **** **** **** {card.last_four} — Exp: {card.expiry_month}/{card.expiry_year}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ProfilePage;
