import localForage from "localforage";
export default localForage.createInstance({
    name: "hca",
    driver      : localForage.INDEXEDDB
});