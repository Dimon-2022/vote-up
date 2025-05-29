import { useEffect, useReducer } from "react";

const initialState = { candidates: [], newCandidate: "", status: "loading" };

function incrementVote(state, name) {
  return {
    ...state,
    candidates: state.candidates.map((candidate) =>
      candidate.name === name
        ? { ...candidate, votes: candidate.votes + 1 }
        : candidate
    ),
  };
}

function decrementVote(state, name) {
  return {
    ...state,
    candidates: state.candidates.map((candidate) =>
      candidate.name === name
        ? { ...candidate, votes: Math.max(candidate.votes - 1, 0) }
        : candidate
    ),
  };
}

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return { ...state, candidates: action.payload, status: "ready" };
    case "dataFailed":
      return { ...state, status: "error" };
    case "reset_votes":
      return {
        ...state,
        candidates: state.candidates.map((candidate) => ({
          ...candidate,
          votes: 0,
        })),
      };
    case "update_new_candidate":
      return { ...state, newCandidate: action.payload };
    case "add_candidate":
      if (
        !action.payload.trim() ||
        state.candidates.some((candidate) => candidate.name === action.payload)
      ) {
        return state;
      }

      return {
        ...state,
        candidates: [...state.candidates, { name: action.payload, votes: 0 }],
        newCandidate: "",
      };
    case "vote_up":
      return incrementVote(state, action.payload);
    case "vote_down":
      return decrementVote(state, action.payload);
  }
}
// case "addCandidates":
//   return { ...state, candidates: action.payload };
// case "addVote":
//   let candidates = [...state.candidates].map((candidate) => {
//     if (candidate.id === action.payload) {
//       return { ...candidate, votes: candidate.votes++ };
//     }
//     return candidate;
//   });

//   return { ...state, candidates };

// case "subtractVote":
//   let candidates1 = [...state.candidates].map((candidate) => {
//     if (candidate.id === action.payload) {
//       return { ...candidate, votes: candidate.votes-- };
//     }
//     return candidate;
//   });
//   return { ...state, candidates: candidates1 };

// case "reset":
//   let candidates2 = [...state.candidates].map((candidate) => {
//     return { ...candidate, votes: 0 };
//   });

//   return { ...state, candidates: candidates2 };

// case "addNewCandidate":
//   return { ...state, candidates: [...state.candidates, action.payload] };

//  case "setInput":
//   return {...state, inputValue: action.payload};

function VoteTracker() {
  // If status is "ready", render main content

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("http://localhost:9000/candidates");

        if (!res.ok) {
          throw new Error("Failed to get candidates");
        }

        const data = await res.json();
        dispatch({ type: "dataReceived", payload: data });
      } catch (err) {
        dispatch({ type: "dataFailed" });
      }
    }

    fetchData();
  }, []);

  if (state.status === "loading") {
    return <p>Loading data, please wait...</p>;
  }

  if (state.status === "error") {
    return <p>Failed to fetch data. Please try again</p>;
  }

  return (
    <>
      <h1>Vote Tracker</h1>
      <ul>
        {state.candidates.map((candidate) => (
          <li key={candidate.id}>
            {candidate.name}: {candidate.votes} votes
            <button
              onClick={() => {
                dispatch({ type: "vote_up", payload: candidate.name });
              }}
            >
              +
            </button>
            <button
              onClick={() =>
                dispatch({ type: "vote_down", payload: candidate.name })
              }
            >
              -
            </button>
          </li>
        ))}
      </ul>
      <button onClick={() => dispatch({ type: "reset_votes" })}>
        Reset Votes
      </button>

      <div>
        <h2>Add Candidate</h2>
        <input
          type="text"
          placeholder="Candidate name"
          value={state.newCandidate}
          onChange={(e) => {
            dispatch({ type: "update_new_candidate", payload: e.target.value });
          }}
        />
        <button
          onClick={() =>
            dispatch({
              type: "add_candidate",
              payload: state.newCandidate,
            })
          }
        >
          Add
        </button>
      </div>
    </>
  );
}

export default VoteTracker;
