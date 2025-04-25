import { type ThemeConfig } from '@/types/theme'

export const roleThemes: Record<string, ThemeConfig> = {
  admin: {
    colors: {
      primary: {
        background: 'bg-blue-500',
        text: 'text-blue-500',
        border: 'border-blue-500',
        hover: 'hover:bg-blue-600',
        focus: 'focus:ring-blue-500',
      },
      secondary: {
        background: 'bg-slate-500',
        text: 'text-slate-500',
        border: 'border-slate-500',
        hover: 'hover:bg-slate-600',
        focus: 'focus:ring-slate-500',
      }
    },
    layout: {
      maxWidth: 'max-w-[2000px]',
      padding: 'p-8',
      headerHeight: 'h-16',
      sidebarWidth: 'w-64'
    },
    components: {
      card: {
        base: 'bg-white shadow-lg rounded-lg border',
        header: 'p-6 border-b',
        content: 'p-6'
      },
      button: {
        base: 'rounded-md font-medium transition-colors',
        primary: 'bg-blue-500 text-white hover:bg-blue-600',
        secondary: 'bg-slate-500 text-white hover:bg-slate-600'
      }
    }
  },
  manager: {
    colors: {
      primary: {
        background: 'bg-emerald-500',
        text: 'text-emerald-500',
        border: 'border-emerald-500',
        hover: 'hover:bg-emerald-600',
        focus: 'focus:ring-emerald-500',
      },
      secondary: {
        background: 'bg-slate-500',
        text: 'text-slate-500',
        border: 'border-slate-500',
        hover: 'hover:bg-slate-600',
        focus: 'focus:ring-slate-500',
      }
    },
    layout: {
      maxWidth: 'max-w-[1800px]',
      padding: 'p-6',
      headerHeight: 'h-16',
      sidebarWidth: 'w-64'
    },
    components: {
      card: {
        base: 'bg-white shadow rounded-lg border',
        header: 'p-5 border-b',
        content: 'p-5'
      },
      button: {
        base: 'rounded-md font-medium transition-colors',
        primary: 'bg-emerald-500 text-white hover:bg-emerald-600',
        secondary: 'bg-slate-500 text-white hover:bg-slate-600'
      }
    }
  },
  cashier: {
    colors: {
      primary: {
        background: 'bg-violet-500',
        text: 'text-violet-500',
        border: 'border-violet-500',
        hover: 'hover:bg-violet-600',
        focus: 'focus:ring-violet-500',
      },
      secondary: {
        background: 'bg-slate-500',
        text: 'text-slate-500',
        border: 'border-slate-500',
        hover: 'hover:bg-slate-600',
        focus: 'focus:ring-slate-500',
      }
    },
    layout: {
      maxWidth: 'max-w-[1400px]',
      padding: 'p-4',
      headerHeight: 'h-14',
      sidebarWidth: 'w-56'
    },
    components: {
      card: {
        base: 'bg-white shadow-sm rounded-lg border',
        header: 'p-4 border-b',
        content: 'p-4'
      },
      button: {
        base: 'rounded-md font-medium transition-colors',
        primary: 'bg-violet-500 text-white hover:bg-violet-600',
        secondary: 'bg-slate-500 text-white hover:bg-slate-600'
      }
    }
  },
  worker: {
    colors: {
      primary: {
        background: 'bg-orange-500',
        text: 'text-orange-500',
        border: 'border-orange-500',
        hover: 'hover:bg-orange-600',
        focus: 'focus:ring-orange-500',
      },
      secondary: {
        background: 'bg-slate-500',
        text: 'text-slate-500',
        border: 'border-slate-500',
        hover: 'hover:bg-slate-600',
        focus: 'focus:ring-slate-500',
      }
    },
    layout: {
      maxWidth: 'max-w-[1200px]',
      padding: 'p-4',
      headerHeight: 'h-14',
      sidebarWidth: 'w-56'
    },
    components: {
      card: {
        base: 'bg-white shadow-sm rounded-lg border',
        header: 'p-4 border-b',
        content: 'p-4'
      },
      button: {
        base: 'rounded-md font-medium transition-colors',
        primary: 'bg-orange-500 text-white hover:bg-orange-600',
        secondary: 'bg-slate-500 text-white hover:bg-slate-600'
      }
    }
  }
}
