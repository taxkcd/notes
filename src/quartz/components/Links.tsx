import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { FullSlug, SimpleSlug, resolveRelative } from "../util/path"
import { QuartzPluginData } from "../plugins/vfile"
import { byDateAndAlphabetical } from "./PageList"
import style from "./styles/links.scss"
import { Date, getDate } from "./Date"
import { GlobalConfiguration } from "../cfg"

interface Options {
  title: string
}

const defaultOptions = (cfg: GlobalConfiguration): Options => ({
  title: "",
})

export default ((userOpts?: Partial<Options>) => {
  function Links({ allFiles, fileData, displayClass, cfg }: QuartzComponentProps) {
    const opts = { ...defaultOptions(cfg), ...userOpts }
    return (
      <div class={`links ${displayClass ?? ""}`}>
        <h3>{opts.title}</h3>
        <ul>
          <li>
            <h3 style={{marginTop: 0, marginBottom: 0}}><a href="/notes/dsa">DSA</a></h3>
            <i>Learning notes about DSA</i>
          </li>          
          <li>
            <h3 style={{marginTop: 0, marginBottom: 0}}><a href="/notes/system-design">System Design</a></h3>
            <i>Learning notes about system design</i>
          </li>          
          <li>
            <h3 style={{marginTop: 0, marginBottom: 0}}><a href="/notes/ai-ml">Machine Learning</a></h3>
            <i>Learning notes about AI and ML</i>
          </li>
          <li>
            <h3 style={{marginTop: 0, marginBottom: 0}}><a href="/notes/cheatsheets">Cheatsheets</a></h3>
            <i>Learning notes about cheatsheets</i>
          </li>
          <li>
            <h3 style={{marginTop: 0, marginBottom: 0}}><a href="/notes/js">Javascript</a></h3>
            <i>Learning notes about javascript</i>
          </li>
          <li>
            <h3 style={{marginTop: 0, marginBottom: 0}}><a href="/notes/guitar">Guitar</a></h3>
            <i>Learning notes about Guitar</i>
          </li>          
        </ul>
      </div>
    )
  }

  Links.css = style
  return Links
}) satisfies QuartzComponentConstructor