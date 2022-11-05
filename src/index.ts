import * as path from 'path' 
import * as fs from 'fs'
import * as superagent from 'superagent'
import CCrawlDataClass from './crawldata'

export interface IConvertContent {
  convertContent: (html: string, filePath: string) => string
}

class CEntryMainClass {
  private filePath = path.resolve(__dirname, '../data/data.json')

  private async getRawHtml() {
    const result = await superagent.get(this.url)
    return result.text
  }

  private writeFile(content: string) {
    fs.writeFileSync(this.filePath, content)
  }

  private async initProcess() {
    const html = await this.getRawHtml()
    const fileContent = this.crawldata.convertContent(html, this.filePath)
    this.writeFile(fileContent)
  }
  constructor(private url: string, private crawldata: IConvertContent) {
    this.initProcess()
  }
}

const url = 'https://www.jianshu.com'
const crawldata = CCrawlDataClass.getInstance()
new CEntryMainClass(url, crawldata)
