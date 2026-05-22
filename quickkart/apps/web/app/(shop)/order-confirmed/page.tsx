'use client'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  CheckCircle, Clock, MapPin, Package,
  ShoppingBag, Loader2
} from 'lucide-react'
import api from '@/lib/api'
import { useAuth } from "../../../hooks/useAuth"
import Image from 'next/image'

interface OrderDetail {
  id: string
  orderNumber: string
  total: number
  subtotal: number
  deliveryFee: number
  discount: number
  status: string
  placedAt: string
  items: {
    id: string
    name: string
    price: number
    quantity: number
    image: string
  }[]
  address: {
    label: string
    line1: string
    line2?: string
    city: string
    state: string
    pincode: string
  }
}

function OrderConfirmedContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const orderId = searchParams.get('id')
  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const { getToken } = useAuth()

  useEffect(() => {
    if (!orderId) {
      router.push('/')
      return
    }
    const fetchOrder = async () => {
      try {
        const token = await getToken()
        const res = await api.get(`/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setOrder(res.data.data)
      } catch (err) {
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    fetchOrder()
  }, [orderId, getToken, router])

  const formatPrice = (amount: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)

  if (loading) return (
    <div className="min-h-screen bg-bg flex items-center
      justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand
          mx-auto mb-3" />
        <p className="text-text-secondary">
          Loading your order...
        </p>
      </div>
    </div>
  )

  if (error || !order) return (
    <div className="min-h-screen bg-bg flex items-center
      justify-center p-4">
      <div className="text-center">
        <Package className="w-12 h-12 text-text-muted
          mx-auto mb-3" />
        <p className="font-semibold text-text-primary mb-2">
          Order not found
        </p>
        <Link href="/" className="text-brand font-semibold">
          Go home
        </Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-bg pb-24">
      <div className="max-w-lg mx-auto px-4 py-6">

        {/* Success Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-success
            flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-success mb-1">
            Order placed!
          </h1>
          <p className="text-text-secondary text-sm">
            Thank you for shopping with KashGro
          </p>
        </div>

        {/* Order Info Card */}
        <div className="bg-surface rounded-xl border border-border
          p-4 mb-4">
          <div className="flex justify-between items-center
            mb-3">
            <span className="text-sm text-text-secondary">
              Order number
            </span>
            <span className="text-sm font-bold font-mono
              text-text-primary">
              {order.orderNumber}
            </span>
          </div>
          <div className="flex justify-between items-center
            mb-3">
            <span className="text-sm text-text-secondary">
              Estimated delivery
            </span>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-success" />
              <span className="text-sm font-semibold
                text-success">
                20-30 minutes
              </span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-text-secondary">
              Payment
            </span>
            <span className="text-sm font-semibold
              text-text-primary">
              Cash on Delivery
            </span>
          </div>
        </div>

        {/* Items */}
        <div className="bg-surface rounded-xl border
          border-border p-4 mb-4">
          <p className="text-xs font-semibold text-text-muted
            uppercase tracking-wider mb-3">
            Items ordered
          </p>
          <div className="space-y-3">
            {order.items.map(item => (
              <div key={item.id} className="flex items-center
                gap-3">
                <div className="relative w-11 h-11 rounded-lg bg-bg
                  flex items-center justify-center flex-shrink-0 overflow-hidden border border-border">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain p-1"
                      sizes="44px"
                    />
                  ) : (
                    <ShoppingBag className="w-5 h-5
                      text-text-muted" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold
                    text-text-primary truncate">
                    {item.name}
                  </p>
                  <p className="text-xs text-text-muted">
                    Qty: {item.quantity}
                  </p>
                </div>
                <span className="text-sm font-bold
                  text-text-primary">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Address */}
        <div className="bg-surface rounded-xl border
          border-border p-4 mb-4">
          <p className="text-xs font-semibold text-text-muted
            uppercase tracking-wider mb-3">
            Delivering to
          </p>
          <div className="flex gap-2">
            <MapPin className="w-4 h-4 text-brand
              flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold
                text-text-primary">
                {order.address.label}
              </p>
              <p className="text-xs text-text-secondary
                leading-relaxed">
                {order.address.line1}
                {order.address.line2 &&
                  `, ${order.address.line2}`}<br/>
                {order.address.city},
                {order.address.state} —
                {order.address.pincode}
              </p>
            </div>
          </div>
        </div>

        {/* Total Breakdown */}
        <div className="bg-surface rounded-xl border
          border-border p-4 mb-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-text-secondary">
              Subtotal
            </span>
            <span className="text-sm text-text-primary">
              {formatPrice(order.subtotal)}
            </span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-text-secondary">
              Delivery fee
            </span>
            <span className="text-sm text-text-primary">
              {order.deliveryFee === 0
                ? 'Free'
                : formatPrice(order.deliveryFee)}
            </span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between mb-2">
              <span className="text-sm text-text-secondary">
                Discount
              </span>
              <span className="text-sm text-success">
                -{formatPrice(order.discount)}
              </span>
            </div>
          )}
          <div className="flex justify-between pt-3
            border-t border-border">
            <span className="font-bold text-text-primary">
              Total
            </span>
            <span className="font-bold text-text-primary">
              {formatPrice(order.total)}
            </span>
          </div>
        </div>

        {/* COD Notice */}
        <div className="bg-brand-light border border-brand
          rounded-xl p-4 mb-6 flex items-center gap-3">
          <span className="text-2xl">🛵</span>
          <p className="text-sm font-semibold text-text-primary">
            Pay {formatPrice(order.total)} when your
            order arrives at your door
          </p>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <Link
            href={`/orders/${order.id}`}
            className="block w-full py-3 bg-brand text-black
              font-bold text-center rounded-xl"
          >
            Track Order
          </Link>
          <Link
            href="/"
            className="block w-full py-3 border
              border-border text-text-secondary font-semibold
              text-center rounded-xl"
          >
            Continue Shopping
          </Link>
        </div>

      </div>
    </div>
  )
}

export default function OrderConfirmedPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand mx-auto mb-3" />
        <p className="text-text-secondary">Loading...</p>
      </div>
    }>
      <OrderConfirmedContent />
    </Suspense>
  )
}
