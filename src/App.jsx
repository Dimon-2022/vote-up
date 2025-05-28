function VoteTracker() {
  // If status is "ready", render main content
  return (
    <>
      <h1>Vote Tracker</h1>
      <ul>
        <li>
          Dima: 10 votes
          <button>+</button>
          <button>-</button>
        </li>
      </ul>
      <button>Reset Votes</button>

      <div>
        <h2>Add Candidate</h2>
        <input type="text" placeholder="Candidate name" />
        <button>Add</button>
      </div>
    </>
  );
}

export default VoteTracker;
