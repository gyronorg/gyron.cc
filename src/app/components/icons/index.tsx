import { FC } from 'gyron'
import classnames from 'classnames'

interface IconProps {
  class?: string
  c1?: string
  c2?: string
  expand?: () => void
}

export const LogoIcon = FC<IconProps>(({ class: className }) => {
  return (
    <svg
      viewBox="0 0 1024 1024"
      class={classnames(
        'w-5 h-5 cursor-pointer fill-current hover:fill-current',
        className
      )}
      aria-hidden="true"
    >
      <path
        class="cls-1"
        d="M497,804.28c-49.62,11.58-89.46,17.45-119.24,17.45H206.25V70.66H322.12q70.67,0,107.76,2.61t86.33,26.83q49.23,24.23,89.8,72.62t63.15,118.42q20,62,22.25,136.93a242.09,242.09,0,0,1,119.87-3.92Q806.74,340.21,778.66,265q-33.63-89.61-95-153.09T542.28,24.21Q462.33,0,282.72,0H0V53.65q66,0,83.43,14.39t17.38,82.43V747.14q0,49.74-12.75,72T44,837.42H0v53.65H404.39q65.17,0,119.73-13A327.81,327.81,0,0,1,497,804.28Z"
      />
      <path
        class="cls-1"
        d="M807.73,432.63c.27,7.47.46,15,.46,22.54,0,4.73-.14,9.39-.25,14.06,105.23,25,184.25,130.35,184.25,256.61,0,144.83-104,262.24-232.23,262.24-83.61,0-156.88-49.93-197.77-124.8-10.27,3.65-21,6.78-31.88,9.63C575.71,963.11,661.51,1024,760,1024c145.83,0,264-133.49,264-298.16C1024,579.59,930.74,458,807.73,432.63Z"
      />
      <path
        class="cls-1"
        d="M527.74,725.84c0,50.41,12.62,97.47,34.45,137.44q89.23-31.65,145.52-103.58,96.45-123.26,100.23-290.47a207.69,207.69,0,0,0-48-5.63C631.71,463.6,527.74,581,527.74,725.84Z"
      />
      <path
        class="cls-1"
        d="M292.31,298.29a146.38,146.38,0,0,0,17.6,70.21q45.58-16.17,74.33-52.91,49.26-63,51.19-148.37a106.24,106.24,0,0,0-24.5-2.87C345.42,164.35,292.31,224.32,292.31,298.29Z"
      />
    </svg>
  )
})
export const GithubIcon = FC<IconProps>(({ class: className }) => (
  <svg
    viewBox="0 0 16 16"
    class={classnames(
      'w-5 h-5 cursor-pointer fill-current hover:fill-current',
      className
    )}
    aria-hidden="true"
  >
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
  </svg>
))
export const DarkIcon = () => (
  <svg
    viewBox="0 0 1024 1024"
    class="w-5 h-5 cursor-pointer fill-current hover:fill-current"
    aria-hidden="true"
  >
    <path d="M334.08 104.768c7.04-12.416-6.08-26.368-19.008-20.288a469.44 469.44 0 0 0-270.08 425.088 468.736 468.736 0 0 0 469.44 469.44 469.44 469.44 0 0 0 425.088-270.08c6.08-12.928-7.872-26.048-20.288-19.008a427.328 427.328 0 0 1-211.392 55.552c-237.312 0-429.312-192-429.312-429.312 0-76.8 20.16-148.992 55.552-211.392z m434.432 200.256a19.776 19.776 0 0 0-37.12 0l-18.368 50.56a131.648 131.648 0 0 1-78.72 78.72l-50.56 18.368a19.776 19.776 0 0 0 0 37.12l50.56 18.368a131.648 131.648 0 0 1 78.72 78.72l18.368 50.56c6.336 17.28 30.848 17.28 37.12 0l18.368-50.56a131.712 131.712 0 0 1 78.72-78.72l50.56-18.368a19.776 19.776 0 0 0 0-37.12l-50.56-18.432a131.648 131.648 0 0 1-78.72-78.72l-18.368-50.56zM550.592 105.536a16.32 16.32 0 0 0-30.72 0l-3.584 9.984a67.52 67.52 0 0 1-40.32 40.32l-9.984 3.648a16.32 16.32 0 0 0 0 30.656l9.92 3.648c18.816 6.784 33.6 21.568 40.384 40.32l3.648 9.984a16.32 16.32 0 0 0 30.656 0l3.584-9.984c6.848-18.752 21.632-33.536 40.384-40.32l9.984-3.648a16.32 16.32 0 0 0 0-30.656l-9.984-3.584a67.52 67.52 0 0 1-40.32-40.384l-3.648-9.984z"></path>
  </svg>
)
export const LightIcon = () => (
  <svg
    viewBox="0 0 1024 1024"
    class="w-5 h-5 cursor-pointer fill-current hover:fill-current"
    aria-hidden="true"
  >
    <path d="M512 204.8a307.2 307.2 0 1 1-307.2 307.2 307.2 307.2 0 0 1 307.2-307.2z m0-204.8a51.2 51.2 0 0 1 51.2 51.2v51.2a51.2 51.2 0 1 1-102.4 0V51.2a51.2 51.2 0 0 1 51.2-51.2z m0 870.4a51.2 51.2 0 0 1 51.2 51.2v51.2a51.2 51.2 0 0 1-102.4 0v-51.2a51.2 51.2 0 0 1 51.2-51.2z m409.6-409.6h51.2a51.2 51.2 0 1 1 0 102.4h-51.2a51.2 51.2 0 1 1 0-102.4zM51.2 460.8h51.2a51.2 51.2 0 1 1 0 102.4H51.2a51.2 51.2 0 1 1 0-102.4z m822.784-310.8352a51.2 51.2 0 0 1 0 72.3968l-36.352 36.1984a51.2 51.2 0 0 1-72.192-72.3968l36.352-36.1984a51.2 51.2 0 0 1 72.192 0zM258.56 765.44a51.2 51.2 0 0 1 0 72.3968l-36.352 36.1984a51.2 51.2 0 0 1-72.192-72.3968l36.352-36.1984a51.2 51.2 0 0 1 72.192 0z m579.072 0l36.352 36.1984a51.2 51.2 0 0 1-72.192 72.3968l-36.352-36.1984a51.2 51.2 0 0 1 72.192-72.3968zM222.208 149.9648l36.352 36.1984A51.2 51.2 0 0 1 186.368 258.56l-36.352-36.1984a51.2 51.2 0 1 1 72.192-72.3968z"></path>
  </svg>
)
export const SystemIcon = () => (
  <svg
    viewBox="0 0 1024 1024"
    class="w-5 h-5 cursor-pointer fill-current hover:fill-current"
    aria-hidden="true"
  >
    <path d="M255.68142222 831.57489588h165.72161138l20.69189973-35.54284278c0-19.57341867 13.9188755-35.48070495 31.06891852-35.48070495h77.6722963c17.15004302 0 31.06891852 15.90728628 31.06891852 35.48070495l20.69189973 35.54284278h165.72161138c12.86253227 0 23.30168889 11.93046471 23.30168889 26.59499425 0 14.72666738-10.43915662 26.65713209-23.30168889 26.65713209h-512.63715556c-12.86253227 0-23.30168889-11.93046471-23.30168889-26.65713209 0-14.66452955 10.43915662-26.59499425 23.30168889-26.59499425zM201.31081482 139.17297778h621.37837036a62.13783703 62.13783703 0 0 1 62.13783704 62.13783704v443.85056995a62.13783703 62.13783703 0 0 1-62.13783704 62.13783704H201.31081482a62.13783703 62.13783703 0 0 1-62.13783704-62.13783704V201.31081482a62.13783703 62.13783703 0 0 1 62.13783704-62.13783704z"></path>
  </svg>
)
export const ArrowRightIcon = () => (
  <svg
    width="3"
    height="24"
    viewBox="0 -9 3 24"
    class="mr-2 text-slate-400 overflow-visible group-hover:text-slate-600 dark:text-slate-600 dark:group-hover:text-slate-500"
  >
    <path
      d="M0 0L3 3L0 6"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
    ></path>
  </svg>
)
export const ArrowLeftBoldIcon = () => (
  <svg
    viewBox="0 0 3 6"
    class="mr-3 w-auto h-1.5 text-slate-400 overflow-visible group-hover:text-slate-600 dark:group-hover:text-slate-300"
  >
    <path
      d="M3 0L0 3L3 6"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    ></path>
  </svg>
)
export const ArrowRightBoldIcon = () => (
  <svg
    viewBox="0 0 3 6"
    class="ml-3 w-auto h-1.5 text-slate-400 overflow-visible group-hover:text-slate-600 dark:group-hover:text-slate-300"
  >
    <path
      d="M0 0L3 3L0 6"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    ></path>
  </svg>
)
export const AnchorIcon = () => (
  <svg width="12" height="12" fill="none" aria-hidden="true">
    <path
      d="M3.75 1v10M8.25 1v10M1 3.75h10M1 8.25h10"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
    ></path>
  </svg>
)
export const CopyIcon = FC<IconProps>(({ class: className }) => (
  <svg
    viewBox="0 0 1024 1024"
    class={classnames('fill-current pointer-events-none', className)}
  >
    <path d="M829.568 53.12H960V1024H194.432v-121.344H64V284.48L361.92 0h467.648v53.12z m0 80.896v768.64H279.488v40.448h595.456V134.016h-45.44zM149.056 317.952v503.808h595.456V80.896H397.248L149.12 317.952z"></path>
  </svg>
))
export const MenuIcon = FC<IconProps>(({ class: className, expand }) => (
  <svg width="24" height="24" class={className} onClick={expand}>
    <path
      d="M5 6h14M5 12h14M5 18h14"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
    ></path>
  </svg>
))
export const CloseIcon = FC<IconProps>(({ class: className }) => (
  <svg viewBox="0 0 10 10" class={classnames('overflow-visible', className)}>
    <path
      d="M0 0L10 10M10 0L0 10"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
    ></path>
  </svg>
))
export const AddIcon = FC<IconProps>(({ class: className }) => (
  <svg
    viewBox="0 0 1024 1024"
    width="1024"
    height="1024"
    class={classnames('w-5 h-5', className)}
  >
    <path d="M469.333333 469.333333V170.666667h85.333334v298.666666h298.666666v85.333334h-298.666666v298.666666h-85.333334v-298.666666H170.666667v-85.333334h298.666666z"></path>
  </svg>
))
export const CodeIcon = FC<IconProps>(({ class: className, c1, c2 }) => (
  <svg class={classnames('w-3 h-3', className)} viewBox="0 0 1024 1024">
    <path
      fill={c1}
      d="M932.571429 54.857143H91.428571c-20.228571 0-36.571429 16.342857-36.571428 36.571428v841.142858c0 20.228571 16.342857 36.571429 36.571428 36.571428h841.142858c20.228571 0 36.571429-16.342857 36.571428-36.571428V91.428571c0-20.228571-16.342857-36.571429-36.571428-36.571428z m-45.714286 832H137.142857V137.142857h749.714286v749.714286z"
    ></path>
    <path d="M137.142857 886.857143h749.714286V137.142857H137.142857v749.714286z m388-254.857143h211.428572c4.685714 0 8.571429 4.114286 8.571428 9.142857v54.857143c0 5.028571-3.885714 9.142857-8.571428 9.142857h-211.428572c-4.685714 0-8.571429-4.114286-8.571428-9.142857v-54.857143c0-5.028571 3.885714-9.142857 8.571428-9.142857zM278.857143 624.342857c0-2.628571 1.257143-5.257143 3.314286-6.971428L407.657143 512l-125.485714-105.371429a8.72 8.72 0 0 1-3.314286-6.971428V328c0-7.771429 9.028571-12 14.971428-6.971429l219.428572 183.885715c4.457143 3.657143 4.457143 10.4 0 14.057143l-219.428572 184c-5.942857 5.028571-14.971429 0.8-14.971428-6.971429v-71.657143z"></path>
    <path
      fill={c1}
      d="M293.828571 702.971429l219.428572-184c4.457143-3.657143 4.457143-10.4 0-14.057143l-219.428572-183.885715A9.085714 9.085714 0 0 0 278.857143 328v71.657143c0 2.742857 1.142857 5.257143 3.314286 6.971428L407.657143 512l-125.485714 105.371429a9.257143 9.257143 0 0 0-3.314286 6.971428V696c0 7.771429 9.028571 12 14.971428 6.971429zM516.571429 696c0 5.028571 3.885714 9.142857 8.571428 9.142857h211.428572c4.685714 0 8.571429-4.114286 8.571428-9.142857v-54.857143c0-5.028571-3.885714-9.142857-8.571428-9.142857h-211.428572c-4.685714 0-8.571429 4.114286-8.571428 9.142857v54.857143z"
    ></path>
  </svg>
))
export const LessIcon = FC<IconProps>(({ class: className }) => (
  <svg class={classnames(className)} viewBox="0 0 235.91 101.62">
    <g>
      <path d="M18.7,20.55h8.07v64.59h32.29v8.07H18.7V20.55z" />
      <path d="M67.14,20.55h40.37v8.07H75.22v24.22h24.22v8.07H75.22v24.22h32.29v8.07H67.14V20.55z" />
      <path d="M115.58,28.62h8.07v-8.07h24.22v8.07h8.07v8.07h-8.07v-8.07h-24.22v24.22h24.22v8.07h8.07v24.22h-8.07v8.07h-24.22v-8.07 h-8.07v-8.07h8.07v8.07h24.22V60.92h-24.22v-8.07h-8.07V28.62z" />
      <path d="M164.02,28.62h8.07v-8.07h24.22v8.07h8.07v8.07h-8.07v-8.07H172.1v24.22h24.22v8.07h8.07v24.22h-8.07v8.07H172.1v-8.07 h-8.07v-8.07h8.07v8.07h24.22V60.92H172.1v-8.07h-8.07V28.62z" />
    </g>
  </svg>
))
export const TsxIcon = FC<IconProps>(({ class: className }) => (
  <svg class={classnames(className)} viewBox="0 0 174.64 101.62">
    <g>
      <path d="M13.09,19.79h40.37v8.07H37.31v64.59h-8.07V27.86H13.09V19.79z" />
      <path d="M61.53,27.86h8.07v-8.07h24.22v8.07h8.07v8.07h-8.07v-8.07H69.6v24.22h24.22v8.07h8.07v24.22h-8.07v8.07H69.6v-8.07h-8.07 v-8.07h8.07v8.07h24.22V60.16H69.6v-8.07h-8.07V27.86z" />
      <path d="M109.96,19.79h8.07v24.22h8.07v8.07h8.07v-8.07h8.07V19.79h8.07v24.22h-8.07v8.07h-8.07v8.07h8.07v8.07h8.07v24.22h-8.07 V68.23h-8.07v-8.07h-8.07v8.07h-8.07v24.22h-8.07V68.23h8.07v-8.07h8.07v-8.07h-8.07v-8.07h-8.07V19.79z" />
    </g>
  </svg>
))
export const ShareIcon = FC<IconProps>(({ class: className }) => (
  <svg class={classnames('w-5 h-5', className)} viewBox="0 0 1024 1024">
    <path
      d="M704 341.333333a64 64 0 1 0 0-128 64 64 0 0 0 0 128z m0 85.333334a149.333333 149.333333 0 1 1 0-298.666667 149.333333 149.333333 0 0 1 0 298.666667z m0 384a64 64 0 1 0 0-128 64 64 0 0 0 0 128z m0 85.333333a149.333333 149.333333 0 1 1 0-298.666667 149.333333 149.333333 0 0 1 0 298.666667z m-426.666667-341.333333a64 64 0 1 0 0-128 64 64 0 0 0 0 128z m96.469334 50.005333a149.333333 149.333333 0 1 1 11.648-217.002667L613.546667 256l42.666666 73.898667-231.893333 133.888a150.186667 150.186667 0 0 1-3.712 69.333333l222.08 128.213333-42.666667 73.898667-226.133333-130.56z"
      fill="currentColor"
      data-spm-anchor-id="a313x.7781069.0.i0"
    ></path>
  </svg>
))
