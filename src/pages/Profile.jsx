function Profile() {
  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "40px auto",
        padding: "20px",
      }}
    >
      <h1>👤 My Profile</h1>

      <div
        style={{
          background: "white",
          border: "1px solid #ddd",
          borderRadius: "12px",
          padding: "20px",
          marginTop: "20px",
        }}
      >
        <h2>Personal Information</h2>

        <p>
          <strong>Name:</strong> Guest User
        </p>

        <p>
          <strong>Email:</strong> Not connected
        </p>

        <p>
          <strong>Phone:</strong> -
        </p>

        <p>
          <strong>Default Address:</strong> -
        </p>
      </div>

      <div
        style={{
          background: "white",
          border: "1px solid #ddd",
          borderRadius: "12px",
          padding: "20px",
          marginTop: "20px",
        }}
      >
        <h2>Future Features</h2>

        <ul>
          <li>📍 Saved Addresses</li>
          <li>❤️ Favourite Products</li>
          <li>💳 Payment Methods</li>
          <li>🔔 Notifications</li>
          <li>🎁 Loyalty Points</li>
          <li>⚙️ Account Settings</li>
        </ul>
      </div>
    </div>
  );
}

export default Profile;