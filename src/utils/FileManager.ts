/**
 * This class handles the retrieval and saving of files
 * from various providers, such as:
 * - client upload
 * - localStorage (https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
 * - OneDrive (TODO)
 */

import { ComposerState } from "types"

/**
  * An object containing a file infos.
  * Namely the file name and an unique ID for it.
  */
export interface File {
  name: string
  lastModified: Date
  id: string
}

/**
 * An object containing a list of Files.
 */
export interface FileList {
  files: File[]
}

export default class FileManager {
  storage: Storage
  files: any

  constructor() {
    this.storage = window.localStorage
  }

  setFile(state: ComposerState) {
    let key = state.system.filename
    this.storage.setItem(key, JSON.stringify(state))

    let file: File = {
      name: state.system.filename,
      lastModified: state.system.lastModified,
      id: key
    }

    this.addFileToFileList(file)
  }

  addFileToFileList = (file: File) => {
    let list = this.getSavedFilesList()
    if (list) {
      if ((list.filter(item => item.id === file.id)).length === 0) {
        list.push(file)
      } else {
        let index = list.map(item => item.id).indexOf(file.id)
        list[index] = file
      }
      console.log(list)
      let newList: FileList = {
        files: list
      }
      this.storage.setItem("SAVED_FILES", JSON.stringify(newList))
    }
  }

  getSavedFilesList = () => {
    let rawFiles = this.storage.getItem("SAVED_FILES")
    if (rawFiles) {
      let files = JSON.parse(rawFiles) as FileList
      if (files) {
        return files.files
      } else {
        console.warn("Could't parse previously saved files! Deleting the old files...")
        this.storage.removeItem("SAVED_FILES");
      }
    } else {
      console.warn("No saved files found!")
    }
    return []
  }

  getFile = (id: string) => {
    let rawFile = this.storage.getItem(id)
    if (rawFile) {
      let parsedFile = JSON.parse(rawFile)
      if (parsedFile) return parsedFile
    }
    console.warn("Couldn't get file/parse it correctly!")
    return null
  }

  deleteFile = (id: string) => {
    let list = this.getSavedFilesList()
    let newList = list.filter(item => item.id !== id)
    console.log(id)
    console.log(newList)
    this.storage.setItem("SAVED_FILES", JSON.stringify({files: newList}))
    this.storage.removeItem(id)
    return newList
  }
}