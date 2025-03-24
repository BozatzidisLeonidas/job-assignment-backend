Parse.Cloud.define('getAllLandmarks', async (request) => {
  try {
    const BASE_URL = process.env.SERVER_URL
    const landmarks = await new Parse.Query("Landmark").find({ useMasterKey: true });

    if (landmarks.length === 0) {
      throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, 'No landmarks found.');
    }

    const landmarksData = landmarks.map((landmark) => {
      const photoThumb = landmark.get('photo_thumb');
      return {
        order: typeof landmark.get('order') === 'number' ? landmark.get('order') : null,
        title: landmark.get('title') ?? '',
        short_info: landmark.get('short_info') ?? '',
        photo_thumb: photoThumb ? `${BASE_URL}/${photoThumb.url().replace(/^undefined\//, '')}` : null,
      };
    });

    return landmarksData;
  } catch (error) {
    console.error('Error fetching landmarks:', error);
    throw new Parse.Error(Parse.Error.SCRIPT_FAILED, 'Error fetching landmarks: ' + error.message);
  }
});

Parse.Cloud.define('getLandmarkByOrder', async (request) => {
  try {
    const BASE_URL = process.env.SERVER_URL
    const { order } = request.params;

    if (!order) {
      throw new Parse.Error(Parse.Error.VALIDATION_ERROR, 'Order parameter is required.');
    }
    const query = new Parse.Query("Landmark")
      .equalTo("order", Number(order));

    const landmark = await query.first({ useMasterKey: true });

    if (!landmark) {
      throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, `No landmark found with order ${order}.`);
    }

    const photo = landmark.get('photo');
    const photoThumb = landmark.get('photo_thumb');

    return {
      order: typeof landmark.get('order') === 'number' ? landmark.get('order') : null,
      title: landmark.get('title') ?? '',
      short_info: landmark.get('short_info') ?? '',
      description: landmark.get('description') ?? '',
      url: landmark.get('url') ?? '',
      photo_thumb: photoThumb ? `${BASE_URL}/${photoThumb.url().replace(/^undefined\//, '')}` : null,
      photo: photo ? `${BASE_URL}/${photo.url().replace(/^undefined\//, '')}` : null,
    };

  } catch {
    console.error(`Error fetching landmark with order ${request.params.order}:`, error);
    throw new Parse.Error(Parse.Error.SCRIPT_FAILED, 'Error fetching landmark: ' + error.message);
  }
})

Parse.Cloud.define('searchLandmarks', async (request) => {
  try {
    const searchText = request.params.query;

    if (!searchText) {
      throw new Parse.Error(Parse.Error.INVALID_QUERY, 'Search query is required.');
    }

    const query = new Parse.Query('Landmark')
      .fullText('title', searchText); 
    

    const results = await query.find({ useMasterKey: true });

    return results.map(landmark => ({
      title: landmark.get('title') ?? '',
    }));
  } catch (error) {
    console.error('Error searching landmarks:', error);
    throw new Parse.Error(Parse.Error.SCRIPT_FAILED, 'Error searching landmarks: ' + error.message);
  }
});
