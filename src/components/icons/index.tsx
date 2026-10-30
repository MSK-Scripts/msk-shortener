/**
 * The one place icons come from: Phosphor, regular weight, through its SSR
 * build so the same import works in server and client components.
 *
 * Every icon is decorative by default (aria-hidden, not focusable). Give one
 * an aria-label or aria-labelledby and it is announced instead.
 *
 * Only icons something imports are listed. A new one goes into the import
 * and the export list below, in alphabetical order.
 */
import type { Icon, IconProps } from '@phosphor-icons/react'
import {
  ArrowRight as ArrowRightBase,
  ArrowSquareOut as ArrowSquareOutBase,
  CaretDown as CaretDownBase,
  CaretRight as CaretRightBase,
  ChartBar as ChartBarBase,
  Check as CheckBase,
  CircleNotch as CircleNotchBase,
  Clock as ClockBase,
  Copy as CopyBase,
  DeviceMobile as DeviceMobileBase,
  DownloadSimple as DownloadSimpleBase,
  Eye as EyeBase,
  EyeSlash as EyeSlashBase,
  Globe as GlobeBase,
  LinkSimple as LinkSimpleBase,
  List as ListBase,
  LockSimple as LockSimpleBase,
  Monitor as MonitorBase,
  Moon as MoonBase,
  Plus as PlusBase,
  QrCode as QrCodeBase,
  ShieldCheck as ShieldCheckBase,
  Sun as SunBase,
  Trash as TrashBase,
  Warning as WarningBase,
  WarningCircle as WarningCircleBase,
  X as XBase,
} from '@phosphor-icons/react/dist/ssr'
import { forwardRef } from 'react'

function decorative(Base: Icon): Icon {
  const Decorative = forwardRef<SVGSVGElement, IconProps>(function Decorative(props, ref) {
    const labelled = props['aria-label'] != null || props['aria-labelledby'] != null
    return <Base ref={ref} aria-hidden={labelled ? undefined : true} focusable="false" {...props} />
  })
  Decorative.displayName = Base.displayName
  return Decorative
}

export const ArrowRight = decorative(ArrowRightBase)
export const ArrowSquareOut = decorative(ArrowSquareOutBase)
export const CaretDown = decorative(CaretDownBase)
export const CaretRight = decorative(CaretRightBase)
export const ChartBar = decorative(ChartBarBase)
export const Check = decorative(CheckBase)
export const CircleNotch = decorative(CircleNotchBase)
export const Clock = decorative(ClockBase)
export const Copy = decorative(CopyBase)
export const DeviceMobile = decorative(DeviceMobileBase)
export const DownloadSimple = decorative(DownloadSimpleBase)
export const Eye = decorative(EyeBase)
export const EyeSlash = decorative(EyeSlashBase)
export const Globe = decorative(GlobeBase)
export const LinkSimple = decorative(LinkSimpleBase)
export const List = decorative(ListBase)
export const LockSimple = decorative(LockSimpleBase)
export const Monitor = decorative(MonitorBase)
export const Moon = decorative(MoonBase)
export const Plus = decorative(PlusBase)
export const QrCode = decorative(QrCodeBase)
export const ShieldCheck = decorative(ShieldCheckBase)
export const Sun = decorative(SunBase)
export const Trash = decorative(TrashBase)
export const Warning = decorative(WarningBase)
export const WarningCircle = decorative(WarningCircleBase)
export const X = decorative(XBase)
