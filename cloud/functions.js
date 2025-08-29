const BASE_URL = process.env.SERVER_URL;
if (!BASE_URL) {
  throw new Error('BASE_URL is not defined. Please set the SERVER_URL environment variable.');
}

function formatLandmarkData(landmark) {
  const photoThumb = landmark.get('photo_thumb');
  return {
    order: typeof landmark.get('order') === 'number' ? landmark.get('order') : null,
    title: landmark.get('title') ?? '',
    short_info: landmark.get('short_info') ?? '',
    photo_thumb: photoThumb ? `${BASE_URL}/${photoThumb.url().replace(/^undefined\//, '')}` : null,
  };
}

Parse.Cloud.define('getAllLandmarks', async (request) => {
  try {
    const landmarks = await new Parse.Query("Landmark").find();
    if (landmarks.length === 0) {
      return { success: true, data: [] }
    }
    const landmarksData = landmarks.map(formatLandmarkData);
    return { success: true, data: landmarksData };
  } catch (error) {
    console.error('Error fetching landmarks:', error);
    return { success: false, errorMessage: 'Error fetching landmarks: ' + error.message }
  }
});

Parse.Cloud.define('getLandmarkByOrder', async (request) => {
  try {
    const { order } = request.params;

    if (!order) {
      console.log('Order Number Parameter is required.');
      return { success: false, errorMessage: 'Order Number Parameter is required.' };
    }

    const query = new Parse.Query("Landmark").equalTo("order", Number(order));
    const landmark = await query.first();

    if (!landmark) {
      console.log(`No landmark found with order ${order}.`);
      return { success: false, errorMessage: `No landmark found with order ${order}.` };
    }

    console.log(landmark.attributes)
    const photo = landmark.get('photo');
    const photoThumb = landmark.get('photo_thumb');

    const landmarkMap = {
      order: typeof landmark.get('order') === 'number' ? landmark.get('order') : null,
      title: landmark.get('title') ?? '',
      short_info: landmark.get('short_info') ?? '',
      description: landmark.get('description') ?? '',
      url: landmark.get('url') ?? '',
      photo_thumb: photoThumb ? `${BASE_URL}/${photoThumb.url().replace(/^undefined\//, '')}` : null,
      photo: photo ? `${BASE_URL}/${photo.url().replace(/^undefined\//, '')}` : null,
    };

    return { success: true, data: landmarkMap };
  } catch (error) {
    console.error(`Error fetching landmark with order ${request.params.order}:`, error);
    return { success: false, errorMessage: `Error fetching landmark with order ${request.params.order}: ${error.message}` };
  }
});

Parse.Cloud.define('searchLandmarks', async (request) => {
  try {
    const { searchText } = request.params;
    if (!searchText) {
      console.error('Search Text Parameter is required.')
      return { success: false, errorMessage: 'Search Text Parameter is required.' };
    }
    const query = new Parse.Query('Landmark').matches('title', searchText, 'i');
    const results = await query.find();

    if (results.length === 0) {
      return { success: true, data: [] }
    }

    const landmarksData = results.map((landmark) => formatLandmarkData(landmark));
    return { success: true, data: landmarksData };

  } catch (error) {
    console.error('Error searching landmark:', error);
    return { success: false, errorMessage: 'Error searching landmark: ' + error.message };
  }
})


/*he .map() function is a method in JavaScript that creates a new array 
Giati cloud functions over aplh JS?
Epeidh einai integrated mporw na xrhsimopoihsw Parse Querys poy exoyn apo mona toys pagination,security(role-based access),data validation,Session Handling.
As your app grows, Parse Server can handle traffic spikes, optimize database queries, and scale the backend automatically.*/