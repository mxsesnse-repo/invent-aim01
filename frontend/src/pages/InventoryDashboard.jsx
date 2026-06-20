import { useState, useEffect, useCallback } from 'react'
import { getTrackingDashboard } from '../api/client'
import {
  Package, LayoutDashboard, IndianRupee, Layers, CheckCircle2, Loader2, ArrowRight
} from 'lucide-react'
import clsx from 'clsx'

const COLOR_MAP = {
  cyan:    { color: 'text-cyan-400',    bg: 'bg-cyan-500/15',    border: 'border-cyan-500/30' },
  purple:  { color: 'text-purple-400',  bg: 'bg-purple-500/15',  border: 'border-purple-500/30' },
  orange:  { color: 'text-orange-400',  bg: 'bg-orange-500/15',  border: 'border-orange-500/30' },
  emerald: { color: 'text-emerald-400', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30' },
  rose:    { color: 'text-rose-400',    bg: 'bg-rose-500/15',    border: 'border-rose-500/30' },
  amber:   { color: 'text-amber-400',   bg: 'bg-amber-500/15',   border: 'border-amber-500/30' },
}

function formatCurrency(v) {
  return v != null ? `₹${Number(v).toLocaleString('en-IN', { maximumFractionDigits: 0 })}` : '—'
}

function StatCard({ icon: Icon, label, value, subtext, color = 'text-[#FCD535]' }) {
  return (
    <div className="bg-[#111] border border-[#333] p-6 flex items-start gap-4 hover:border-[#FCD535] transition-colors group">
      <div className="w-12 h-12 bg-[#FCD535] text-black flex items-center justify-center shrink-0">
        <Icon size={22} />
      </div>
      <div>
        <p className="text-[10px] text-gray-500 font-black tracking-widest uppercase mb-1">{label}</p>
        <p className={clsx('text-2xl font-black tracking-tight', color)}>{value}</p>
        {subtext && <p className="text-[10px] text-gray-600 font-bold tracking-widest mt-1 uppercase">{subtext}</p>}
      </div>
    </div>
  )
}

export default function InventoryDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchDashboard = useCallback(async () => {
    setLoading(true)
    try {
      const { data: resp } = await getTrackingDashboard({})
      setData(resp)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchDashboard() }, [fetchDashboard])

  const summary = data?.summary || {}
  
  // Sort items by Category explicitly, then by date desc
  const items = [...(data?.items || [])].sort((a, b) => {
    const catA = a.category || ''
    const catB = b.category || ''
    if (catA !== catB) return catA.localeCompare(catB)
    return b.invoice_id - a.invoice_id
  })

  const categories = summary.categories || []
  
  // Calculate total quantities
  const totalQuantity = (summary.category_breakdown || []).reduce((acc, cat) => acc + (cat.quantity || 0), 0)

  // Tracking counts
  const completedItems = items.filter(i => i.progress >= 100).length
  const inProgressItems = items.filter(i => i.progress > 0 && i.progress < 100).length

  return (
    <div className="min-h-screen bg-brutal-dark text-white font-mono flex flex-col">

      <div className="max-w-7xl mx-auto w-full px-8 flex-1 pb-20">
        {/* Header */}
        <div className="mb-8 border-b border-[#333] pb-6 flex items-end justify-between">
          <div>
            <h1 className="text-7xl font-black tracking-tighter uppercase flex items-center gap-6">
              <div className="w-16 h-16 bg-[#FCD535] flex items-center justify-center border-4 border-[#FCD535]">
                <LayoutDashboard size={36} className="text-black" />
              </div>
              DASHBOARD
            </h1>
            <div className="text-sm font-bold tracking-widest text-[#FCD535] mt-4 flex items-center gap-4">
              <span>&gt; INVENTORY OVERVIEW</span>
              <div className="w-32 h-[1px] bg-[#FCD535]"></div>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={Package}
            label="Total Units in Stock"
            value={totalQuantity}
            subtext={`ACROSS ${summary.total_invoices || 0} DELIVERIES`}
          />
          <StatCard
            icon={IndianRupee}
            label="Total Inventory Value"
            value={formatCurrency(summary.total_cost)}
            subtext="LIFETIME VALUE"
            color="text-emerald-400"
          />
          <StatCard
            icon={Layers}
            label="In Processing"
            value={inProgressItems}
            subtext="ITEMS CURRENTLY IN WORKFLOWS"
            color="text-orange-400"
          />
          <StatCard
            icon={CheckCircle2}
            label="Fully Processed"
            value={completedItems}
            subtext="COMPLETED ALL STEPS"
            color="text-emerald-400"
          />
        </div>

        {/* Category Breakdown visual cards */}
        <h2 className="text-sm font-black tracking-widest text-[#FCD535] mb-4 uppercase">CATEGORY BREAKDOWN</h2>
        {summary.category_breakdown?.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            {summary.category_breakdown.map(cat => {
              const catData = categories.find(c => c.name === cat.name)
              const cc = COLOR_MAP[catData?.color] || COLOR_MAP.cyan
              return (
                <div key={cat.name} className={clsx('border p-4 transition-colors', cc.border, cc.bg)}>
                  <p className={clsx('text-xs font-black tracking-widest uppercase', cc.color)}>{cat.name}</p>
                  <p className="text-2xl font-black text-white mt-2">{cat.quantity} <span className="text-xs text-gray-500 font-bold">UNITS</span></p>
                  <p className="text-xs text-gray-400 font-bold mt-1">{formatCurrency(cat.total)}</p>
                </div>
              )
            })}
          </div>
        )}

        <div className="divider-striped-yellow mb-8"></div>

        <h2 className="text-sm font-black tracking-widest text-[#FCD535] mb-4 uppercase">INVENTORY ITEMS (SORTED BY CATEGORY)</h2>

        {/* Items Table */}
        <div className="card-brutal-dark relative">
          {loading && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10">
              <Loader2 className="animate-spin text-[#FCD535]" size={32} />
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#111] border-b-2 border-[#333]">
                <tr>
                  {['CATEGORY', 'ITEM DESCRIPTION', 'QUANTITY', 'TOTAL COST', 'CURRENT STAGE', 'STATUS'].map(h => (
                    <th key={h} className="py-4 px-4 text-xs font-black tracking-widest text-[#FCD535] whitespace-nowrap border-r border-[#222] last:border-0">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-20 text-gray-600 font-bold tracking-widest">
                      <LayoutDashboard size={48} className="mx-auto mb-4 opacity-20" />
                      {loading ? 'LOADING...' : 'NO INVENTORY ITEMS FOUND.'}
                    </td>
                  </tr>
                ) : (
                  items.map((item, idx) => {
                    const catData = categories.find(c => c.name === item.category)
                    const cc = COLOR_MAP[catData?.color] || COLOR_MAP.cyan
                    return (
                      <tr
                        key={item.invoice_id}
                        className={clsx(
                          'border-b border-[#222] hover:bg-[#1a1a1a] transition-colors',
                          idx % 2 === 0 ? 'bg-black' : 'bg-[#0a0a0a]'
                        )}
                      >
                        <td className="py-3 px-4 border-r border-[#222]">
                          <span className={clsx(
                            'inline-flex items-center px-2 py-1 text-[10px] font-black tracking-widest uppercase rounded-sm border',
                            cc.bg, cc.color, cc.border
                          )}>
                            {item.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-xs font-bold text-white max-w-[300px] truncate border-r border-[#222]">
                          {item.description || '—'}
                        </td>
                        <td className="py-3 px-4 text-lg font-black text-[#FCD535] border-r border-[#222]">
                          {item.quantity || 0}
                        </td>
                        <td className="py-3 px-4 text-sm font-black text-white border-r border-[#222]">
                          {formatCurrency(item.grand_total)}
                        </td>
                        <td className="py-3 px-4 border-r border-[#222]">
                          {item.current_stage ? (
                            <span className={clsx(
                              'text-[10px] font-black tracking-widest uppercase px-2 py-1 flex items-center gap-2 w-max',
                              item.current_stage === 'COMPLETED'
                                ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
                                : 'text-[#FCD535] bg-[#FCD535]/10 border border-[#FCD535]/20'
                            )}>
                              {item.current_stage !== 'COMPLETED' && <ArrowRight size={10} />}
                              {item.current_stage}
                            </span>
                          ) : (
                            <span className="text-[10px] text-gray-600 font-bold tracking-widest uppercase">—</span>
                          )}
                        </td>
                        <td className="py-3 px-4 min-w-[140px]">
                          {item.progress >= 100 ? (
                            <span className="text-[10px] text-emerald-400 font-black tracking-widest uppercase flex items-center gap-1">
                              <CheckCircle2 size={12} /> PROCESSED
                            </span>
                          ) : item.progress > 0 ? (
                            <span className="text-[10px] text-orange-400 font-black tracking-widest uppercase">
                              IN PROGRESS ({item.progress}%)
                            </span>
                          ) : (
                            <span className="text-[10px] text-gray-600 font-bold tracking-widest uppercase">PENDING</span>
                          )}
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
