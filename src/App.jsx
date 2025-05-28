import { useEffect, useReducer } from "react";

const initialValue = { candidates: [], inputValue: "" };

function reducer(state, action) {
  switch (action.type) {
    case "addCandidates":
      return { ...state, candidates: action.payload };
    case "addVote":
      let candidates = [...state.candidates].map((candidate) => {
        if (candidate.id === action.payload) {
          return { ...candidate, votes: candidate.votes++ };
        }
        return candidate;
      });

      return { ...state, candidates };

    case "subtractVote":
      let candidates1 = [...state.candidates].map((candidate) => {
        if (candidate.id === action.payload) {
          return { ...candidate, votes: candidate.votes-- };
        }
        return candidate;
      });
      return { ...state, candidates: candidates1 };

    case "reset":
      let candidates2 = [...state.candidates].map((candidate) => {
        return { ...candidate, votes: 0 };
      });

      return { ...state, candidates: candidates2 };

    case "addNewCandidate":
      return { ...state, candidates: [...state.candidates, action.payload] };

     case "setInput":
      return {...state, inputValue: action.payload}; 
  }
}

function VoteTracker() {
  // If status is "ready", render main content

  const [state, dispatch] = useReducer(reducer, initialValue);

  useEffect(() => {
    async function getCandidates() {
      try {
        const res = await fetch("http://localhost:9000/candidates");

        if (!res.ok) {
          throw new Error("Failed to get candidates");
        }

        const candidates = await res.json();
        dispatch({ type: "addCandidates", payload: candidates });
      } catch (err) {
        console.log(err.message);
      }
    }

    getCandidates();
  }, []);

  return (
    <>
      <h1>Vote Tracker</h1>
      <ul>
        {state.candidates.map((candidate) => (
          <li key={candidate.id}>
            {candidate.name}: {candidate.votes} votes
            <button
              onClick={() => {
                dispatch({ type: "addVote", payload: candidate.id });
              }}
            >
              +
            </button>
            <button
              onClick={() =>
                dispatch({ type: "subtractVote", payload: candidate.id })
              }
            >
              -
            </button>
          </li>
        ))}
      </ul>
      <button onClick={() => dispatch({ type: "reset" })}>Reset Votes</button>

      <div>
        <h2>Add Candidate</h2>
        <input
          type="text"
          placeholder="Candidate name"
          value={state.inputValue}
          onChange={(e) => {
           dispatch({type: "setInput", payload: e.target.value});
          }}
        />
        <button onClick={() => dispatch({ type: "addNewCandidate", payload: { id: state.candidates.length + 1, name: state.inputValue, votes: 0 } })}>Add</button>
      </div>
    </>
  );
}

export default VoteTracker;
