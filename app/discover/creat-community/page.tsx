import React, { useState } from 'react';

const CreateCommunityPage = () => {
  const [step, setStep] = useState(0);
  const [communityData, setCommunityData] = useState({
    name: '',
    description: '',
    tags: [],
    image: null,
    chatRooms: [{ name: 'general', type: 'Text' }],
    isPrivate: false,
  });

  const handleNext = () => setStep((prev) => Math.min(prev + 1, 2));
  const handleBack = () => setStep((prev) => Math.max(prev - 1, 0));
  const handleInputChange = (field, value) => {
    setCommunityData((prev) => ({ ...prev, [field]: value }));
  };

  const handleChatRoomChange = (index, field, value) => {
    const updatedChatRooms = [...communityData.chatRooms];
    updatedChatRooms[index][field] = value;
    setCommunityData((prev) => ({ ...prev, chatRooms: updatedChatRooms }));
  };

  const addChatRoom = () => {
    setCommunityData((prev) => ({
      ...prev,
      chatRooms: [...prev.chatRooms, { name: '', type: 'Text' }],
    }));
  };

  const removeChatRoom = (index) => {
    const updatedChatRooms = communityData.chatRooms.filter((_, i) => i !== index);
    setCommunityData((prev) => ({ ...prev, chatRooms: updatedChatRooms }));
  };

  const handleSubmit = () => {
    console.log('Community Data:', communityData);
    // Submit logic here
  };

  return (
    <div className="create-community">
      <h1>Create Community</h1>
      <div className="steps">
        <button disabled={step === 0} onClick={handleBack}>Back</button>
        <button onClick={step === 2 ? handleSubmit : handleNext}>
          {step === 2 ? 'Create Community' : 'Next'}
        </button>
      </div>
      {step === 0 && (
        <div className="basic-info">
          <h2>Basic Info</h2>
          <input
            type="text"
            placeholder="Enter community name"
            value={communityData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
          />
          <textarea
            placeholder="Describe your community's purpose"
            value={communityData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
          />
          <input
            type="text"
            placeholder="Add tags (Press Enter to add)"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.target.value.trim()) {
                handleInputChange('tags', [...communityData.tags, e.target.value.trim()]);
                e.target.value = '';
              }
            }}
          />
          <div className="tags">
            {communityData.tags.map((tag, index) => (
              <span key={index} className="tag">
                {tag}
                <button onClick={() => handleInputChange('tags', communityData.tags.filter((_, i) => i !== index))}>
                  &times;
                </button>
              </span>
            ))}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleInputChange('image', e.target.files[0])}
          />
        </div>
      )}
      {step === 1 && (
        <div className="chat-rooms">
          <h2>Chat Rooms</h2>
          {communityData.chatRooms.map((room, index) => (
            <div key={index} className="chat-room">
              <input
                type="text"
                placeholder="Room name"
                value={room.name}
                onChange={(e) => handleChatRoomChange(index, 'name', e.target.value)}
              />
              <select
                value={room.type}
                onChange={(e) => handleChatRoomChange(index, 'type', e.target.value)}
              >
                <option value="Text">Text</option>
                <option value="Voice">Voice</option>
              </select>
              <button onClick={() => removeChatRoom(index)}>&times;</button>
            </div>
          ))}
          <button onClick={addChatRoom}>+ Add Chat Room</button>
        </div>
      )}
      {step === 2 && (
        <div className="settings">
          <h2>Settings</h2>
          <label>
            <input
              type="checkbox"
              checked={communityData.isPrivate}
              onChange={(e) => handleInputChange('isPrivate', e.target.checked)}
            />
            Private Community
          </label>
          <div className="preview">
            <h3>Community Preview</h3>
            <p>{communityData.name || 'Community Name'}</p>
            <p>{communityData.description || 'Community description will appear here'}</p>
            <p>{communityData.tags.length ? communityData.tags.join(', ') : 'No tags added'}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateCommunityPage;
