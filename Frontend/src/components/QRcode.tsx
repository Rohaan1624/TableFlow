import { QRCodeSVG } from 'qrcode.react'

const MenuQRCode = ({ restaurantId }: { restaurantId: string }) => {
  const menuUrl = `${window.location.origin}/public-menu/${restaurantId}`

  const handleDownload = () => {
    const svg = document.getElementById('menu-qr')!
    const svgData = new XMLSerializer().serializeToString(svg)
    const blob = new Blob([svgData], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `menu-qr-${restaurantId}.svg`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <QRCodeSVG
        id="menu-qr"
        value={menuUrl}
        size={256}
        level="H"
        marginSize={4}   // 4 is the equivalent of includeMargin={true}
        />
      <p>{menuUrl}</p>
      <button onClick={handleDownload}>Download QR</button>
    </div>
  )
}