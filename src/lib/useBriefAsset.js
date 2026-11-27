import { useEffect, useState } from "react";

const requests = new Map();

function loadBriefAsset(path) {
  if (!requests.has(path)) {
    const request = fetch(import.meta.env.BASE_URL + "briefs/" + path)
      .then((response) => {
        if (!response.ok) throw new Error(`Could not load ${path}: ${response.status}`);
        return response.json();
      })
      .catch((error) => {
        requests.delete(path);
        throw error;
      });
    requests.set(path, request);
  }
  return requests.get(path);
}

export default function useBriefAsset(path) {
  const [result, setResult] = useState(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!path) return;
    let current = true;
    loadBriefAsset(path).then(
      (data) => {
        if (current) setResult({ path, attempt, data });
      },
      (error) => {
        if (current) setResult({ path, attempt, error });
      },
    );
    return () => {
      current = false;
    };
  }, [path, attempt]);

  const currentResult = result?.path === path && result?.attempt === attempt ? result : null;
  return { ...currentResult, retry: () => setAttempt((previous) => previous + 1) };
}
