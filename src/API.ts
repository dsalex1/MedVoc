import vocabulary, { VocabularyType } from "./util/vocabulary";
export type Progress = {
    correctCounter: number;
    checkedCounter: number;
};

export interface Profile {
    id: number;
    vocabulary: (VocabularyType & { progress: Progress })[];
}

const EMPTY_PROFILE: Profile = {
    id: -1,
    vocabulary: vocabulary.map(v => ({ ...v, progress: { correctCounter: 0, checkedCounter: 0 } }))
};

const getItemOrElse = <T>(key: string, elseVal: T = {} as T) => {
    const val = localStorage.getItem(key);
    if (val) return JSON.parse(val);
    localStorage.setItem(key, JSON.stringify(elseVal));
    return elseVal;
};

export const getProfiles = (): Profile[] => getItemOrElse("profiles", []);

export const getCurrentProfileId = (): string => getItemOrElse("currentProfile", "");

export const setCurrentProfile = (id: number) => localStorage.setItem("currentProfile", JSON.stringify(id));

export const getCurrentProfile = (): Profile | undefined => {
    const id = getCurrentProfileId();
    const profiles = getProfiles();
    const found = profiles.find(p => p.id + "" == id);
    if (found) return found;
    if (profiles.length > 0) {
        setCurrentProfile(profiles[0].id);
        return profiles[0];
    }
    return undefined;
};

export const updateCurrentProfile = (data: Profile) => {
    const id = getItemOrElse("currentProfile", null);
    const profiles = getProfiles();
    profiles[profiles.findIndex(p => p.id == id)] = data;
    localStorage.setItem("profiles", JSON.stringify(profiles));
};

export const importProfile = (data: Profile) => {
    data.id = Math.ceil(Math.random() * 2147483);
    const profiles = getProfiles();
    profiles.push(data);
    localStorage.setItem("profiles", JSON.stringify(profiles));
};

export const newProfile = () => importProfile({ ...EMPTY_PROFILE });

export const makeProfileActive = (id: number) => {
    localStorage.setItem("currentProfile", JSON.stringify(id));
};

export const deleteProfile = (id: number) => {
    const profiles = getProfiles();
    const deletedProfile = profiles.find(p => p.id == id);
    localStorage.setItem("profiles", JSON.stringify(profiles.filter(p => p.id != id)));
    const deleted = getItemOrElse("deletedProfiles", []);
    localStorage.setItem("deletedProfiles", JSON.stringify([...deleted, deletedProfile]));
};

export type Group = {
    profileId: number;
    indicies: {
        id: number;
    }[];
};

export const getCurrentGroup = (): Group | null => getItemOrElse("currentGroup", null);

export const setCurrentGroup = (data: Group) => {
    localStorage.setItem("currentGroup", JSON.stringify(data));
};

export const getCurrentWeek = (): Group | null => getItemOrElse("currentWeek", null);

export const setCurrentWeek = (data: Group | null) => {
    localStorage.setItem("currentWeek", JSON.stringify(data));
};

export const updateVocProgress = (index: number, progress: Progress) => {
    const data = getCurrentProfile();
    if (!data) return;
    data.vocabulary[index].progress = progress;
    console.log(data, progress);
    updateCurrentProfile(data);
};

export const getNotificationStatus = (): boolean => getItemOrElse("notificationStatus", false);

export const setNotificationStatus = (s: boolean) => {
    localStorage.setItem("notificationStatus", JSON.stringify(s));
};
