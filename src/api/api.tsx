const URL = 'https://3cf3-221-150-84-108.ngrok-free.app/api';
const TOKEN =
  'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiVVNFUiIsInN1YiI6InFwcXAwMTA5QGdtYWlsLmNvbSIsImlhdCI6MTc0NzczMzAyMCwiZXhwIjoxNzU2MzczMDIwfQ.92m7jX6mvuGTrf_1oZioITxr-NRw6AYueOHAEbT-FXE';

export const getUserProfile = async () => {
  try {
    const response = await fetch(`${URL}/user`, {
      method: 'GET',
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${TOKEN}`,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('서버 응답:', data);
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const getMyTravelPlans = async () => {
  try {
    const response = await fetch(`${URL}/user/trip-plans`, {
      method: 'GET',
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${TOKEN}`,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('서버 응답:', data);

    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const getFilmRanking = async () => {
  try {
    const response = await fetch(`${URL}/movies/ranking/popular?limit=10`, {
      method: 'GET',
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${TOKEN}`,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('서버 응답:', data);
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const getLikeFilms = async () => {
  try {
    const response = await fetch(`${URL}/user/liked-movies`, {
      method: 'GET',
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${TOKEN}`,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('서버 응답:', data);
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const searchFilm = async (keyword: string) => {
  try {
    const response = await fetch(
      `${URL}/movies/search?query=${encodeURIComponent(keyword)}&page=1`,
      {
        method: 'GET',
        headers: {
          Accept: '*/*',
          Authorization: `Bearer ${TOKEN}`,
        },
      },
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('서버 응답:', data);
    return data.results;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const getFilmData = async (id: number) => {
  try {
    const response = await fetch(`${URL}/movies/${id}`, {
      method: 'GET',
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${TOKEN}`,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('서버 응답:', data);
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const likeFilm = async (movieId: number) => {
  try {
    const response = await fetch(`${URL}/movies/${movieId}/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: '*/*',
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify({}),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('서버 응답:', data);
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const getFilmByLocationId = async (id: number) => {
  try {
    const response = await fetch(`${URL}/filming-locations/${id}`, {
      method: 'GET',
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${TOKEN}`,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('서버 응답:', data);
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const getLocationData = async (id: number) => {
  try {
    const response = await fetch(`${URL}/filming-locations/${id}`, {
      method: 'GET',
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${TOKEN}`,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('서버 응답:', data);
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const getLocationReviews = async (id: number) => {
  try {
    const response = await fetch(`${URL}/filming-locations/${id}/reviews`, {
      method: 'GET',
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${TOKEN}`,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('서버 응답:', data);
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const createTravelPlan = async (
  movieId: number,
  country: string,
  travelHours: number,
  concepts: string[],
  originLat: number,
  originLng: number,
) => {
  try {
    const response = await fetch(`${URL}/trip-plans`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: '*/*',
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify({
        movieId,
        country,
        travelHours,
        concepts,
        originLat,
        originLng,
      }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('서버 응답:', data);
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const deleteTravelPlan = async (id: number) => {
  try {
    const response = await fetch(`${URL}/trip-plans/${id}`, {
      method: 'DELETE',
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${TOKEN}`,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const getTravelPlan = async (id: number) => {
  try {
    const response = await fetch(`${URL}/saved-trip-plans/${id}`, {
      method: 'GET',
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${TOKEN}`,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('서버 응답:', data);
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const patchTravelPlanTitle = async (planId: number, name: string) => {
  try {
    const response = await fetch(`${URL}/saved-trip-plans/${planId}/name`, {
      method: 'PATCH',
      headers: {
        Accept: '*/*',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify({
        name: name,
      }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('서버 응답:', data);
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const postReview = async (
  locationId: number,
  content: string,
  rating: number,
  imageUrl: string | null,
) => {
  try {
    const response = await fetch(
      `${URL}/filming-locations/${locationId}/reviews`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: '*/*',
          Authorization: `Bearer ${TOKEN}`,
        },
        body: JSON.stringify({
          content,
          rating,
          imageUrl,
        }),
      },
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('서버 응답:', data);
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const getMyReviews = async () => {
  try {
    const response = await fetch(`${URL}/filming-locations/my-reviews`, {
      method: 'GET',
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${TOKEN}`,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const deleteReview = async (reviewId: number) => {
  try {
    const response = await fetch(
      `${URL}/filming-locations/reviews/${reviewId}`,
      {
        method: 'DELETE',
        headers: {
          Accept: '*/*',
          Authorization: `Bearer ${TOKEN}`,
        },
      },
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const putReview = async (
  reviewId: number,
  content: string,
  rating: number,
  imageUrl: string | null,
) => {
  try {
    const response = await fetch(
      `${URL}/filming-locations/reviews/${reviewId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: '*/*',
          Authorization: `Bearer ${TOKEN}`,
        },
        body: JSON.stringify({
          content,
          rating,
          imageUrl,
        }),
      },
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('서버 응답:', data);
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};
