import realm from '../db/schema';

const CategoryImage = (() => {
  return {
    upsertCollection,
    getPendingDownload,
    deleteAll,
    byCategory,
  }

  function byCategory(category_id) {
    return realm.objects('CategoryImage').filtered(`category_id=${category_id}`);
  }

  function deleteAll() {
    let categories = realm.objects('CategoryImage');

    if (categories.length > 0) {
      realm.write(() => {
        realm.delete(categories);
      });
    }
  }

  function getPendingDownload(category_id) {
    let categoryImages = realm.objects('CategoryImage').filtered(`image_url != null AND image = null`);

    return categoryImages.map(c => {
      return { uuid: c.id, url: c.image_url, type: 'image', obj: c };
    })
  }

  function upsertCollection(collection) {
    for(let i=0; i<collection.length; i++) {
      upsert(_buildData(collection[i]));
    }
  }

  function upsert(params) {
    realm.write(() => {
      realm.create('CategoryImage', params, 'modified');
    })
  }

  function _buildData(category_image) {
    let params = {
      id: category_image.id,
      name: category_image.name,
      image_url: category_image.image_url,
      category_id: category_image.category_id,
    }

    if(!!category_image.offline && !!category_image.image_url) {
      params.image = 'offline'
    }

    return params;
  }

})();

export default CategoryImage;