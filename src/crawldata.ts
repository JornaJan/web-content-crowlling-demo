import * as fs from 'fs'
import * as cheerio from 'cheerio'
import { IConvertContent } from './index'

type TTitle = string

interface ITitles {
  data: TTitle[]
}

interface IContent {
  [propName: string]: TTitle[]
}

export default class CCrawlDataClass implements IConvertContent {
  private static instance: CCrawlDataClass
  public static getInstance() {
    if (!CCrawlDataClass.instance) {
      CCrawlDataClass.instance = new CCrawlDataClass()
    }
    return CCrawlDataClass.instance
  }

  private getHtmlContent(html: string) {
    const $ = cheerio.load(html)
    const items = $('.navbar-nav').find('li')
    const titles: TTitle[] = []
    items.map((_, item) => {
      const title = $(item).find('span').text()
      titles.push(title)
    })

    return {
      data: titles
    }
  }

  private generateContent(titles: ITitles, filePath: string) {
    let fileContent: IContent = {}
    if (fs.existsSync(filePath)) {
      fileContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    }
    fileContent.titles = titles.data
    return fileContent
  }

  public convertContent(html: string, filePath: string) {
    const result = this.getHtmlContent(html)
    const fileContent = this.generateContent(result, filePath)
    return JSON.stringify(fileContent)
  }
  private constructor() {}
}
