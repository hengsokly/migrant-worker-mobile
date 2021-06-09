import realm from '../db/schema';
import categoryList from '../db/json/categories';
import DeviceInfo from 'react-native-device-info';

const Safety = (() => {
  return {
    getAll,
    getRoots,
    getChildren,
    getPendingDownload,
    update,
    upsertCollection,
    deleteAll,
    isDownloaded,
    find,
    seedData,
  }

  function seedData(callback) {
    let appVersion = DeviceInfo.getVersion();
    // let appVersion = "4";
    let collection = getAll().filter(o => o.appVersion == appVersion);
    if (!!collection.length) {
      !!callback && callback();
      return;
    }

    setTimeout(() => {
      deleteAll();
      upsertCollection(categoryList.filter(cat => cat.type == "Categories::Safety"),  appVersion);
      !!callback && callback();
    }, 200);
  }

  function find(id) {
    return realm.objects('Category').filtered(`id=${id}`)[0];
  }

  function getChildren(parent_id) {
    return realm.objects('Category').filtered(`parent_id=${parent_id} SORT(lft ASC)`);
  }

  function isDownloaded() {
    return !!getAll().length && !getPendingDownload().length;
  }

  function deleteAll() {
    realm.write(() => {
      realm.delete(getAll());
    });
  }

  function upsertCollection(categories, appVersion) {
    for(let i=0; i<categories.length; i++) {
      upsert(categories[i]);
    }
  }

  function upsert(category, appVersion) {
    realm.write(() => {
      realm.create('Category', _buildData(category, appVersion), 'modified');
    });
  }

  function _buildData(category, appVersion) {
    let params = {
      uuid: category.uuid,
      id: category.id,
      name: category.name,
      image_url: category.image_url,
      audio: category.audio,
      audio_url: category.audio_url,
      description: category.description,
      type: 'Safety',
      parent_id: category.parent_id,
      last: !!category.last,
      leaf: !!category.leaf,
      lft: category.lft,
      rgt: category.rgt,
      video: !!category.is_video,
      appVersion: appVersion,
    };

    if (!!category.offline && !!category.image_url) {
      params.image = 'offline'
    }

    return params;
  }

  function getPendingDownload() {
    return byPendingImage().concat(byPendingAudio());
  }

  function byPendingImage() {
    let categories = realm.objects('Category').filtered(`type='Safety' AND image_url != null AND image = null`);
    return categories.map(c => {
      return { uuid: c.uuid, url: c.image_url, type: 'image', obj: c };
    })
  }

  function byPendingAudio() {
    let categories = realm.objects('Category').filtered(`type='Safety' AND audio_url != null AND audio = null`);
    return categories.map(c => {
      return { uuid: c.uuid, url: c.audio_url, type: 'audio', obj: c }
    })
  }

  function update(uuid, params={}) {
    realm.write(() => {
      realm.create('Category', Object.assign(params, {uuid: uuid}), 'modified');
    })
  }

  function getRoots() {
    return realm.objects('Category').filtered(`type='Safety' AND parent_id=null SORT(lft ASC)`);
  }

  function getAll() {
    return realm.objects('Category').filtered(`type='Safety'`);
  }
})();

export default Safety;
