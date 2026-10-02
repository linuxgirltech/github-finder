export const fetchGithubUser = async (username: string) => {
  const res = await fetch(`${import.meta.env.VITE_GITHUB_API_URL}/users/${username}`)

  if (!res.ok) throw new Error("User not Found");

  const data = await res.json();
  return data;
}

export const searchGithubUser = async (query: string) => {
  const res = await fetch(`${import.meta.env.VITE_GITHUB_API_URL}/search/users?q=${query}`)

  if (!res.ok) throw new Error("User not Found");

  const data = await res.json();
  return data.items;
}

export const checkIfFollowingGithubUser = async (username: string) => {
  const res = await fetch(`${import.meta.env.VITE_GITHUB_API_URL}/user/following/${username}`, {
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_GITHUB_API_TOKEN}`,
      Accept: 'application/vnd.github+json'
    }
  });

  if (res.status === 204) {
    return true; /// Following
  } else if (res.status === 404) {
    return false; /// Not Following
  } else {
    const errData = await res.json().catch(() => null);
    throw new Error(errData.message || "Failed to check follow status");
  }
}

export const followGithubUser = async (username: string) => {
  const res = await fetch(`${import.meta.env.VITE_GITHUB_API_URL}/user/following/${username}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_GITHUB_API_TOKEN}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json'
    }
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => null);
    throw new Error(errData.message || "Failed to follow user");
  }

  return true;
}
