import { put, list } from '@vercel/blob'
import { type NextRequest, NextResponse } from 'next/server'

const CONFIG_PATH = 'config/site-config.json'

export async function GET() {
  try {
    // List blobs with the config prefix to find our config file
    const { blobs } = await list({ prefix: 'config/' })
    const configBlob = blobs.find(b => b.pathname === CONFIG_PATH)
    
    if (configBlob) {
      const response = await fetch(configBlob.url, { cache: 'no-store' })
      const config = await response.json()
      return NextResponse.json({ success: true, config })
    }
    
    return NextResponse.json({ success: true, config: null })
  } catch (error) {
    console.error('Error loading config:', error)
    return NextResponse.json({ success: true, config: null })
  }
}

export async function POST(request: NextRequest) {
  try {
    const config = await request.json()
    
    // Save config with fixed pathname (overwrites existing)
    const blob = await put(CONFIG_PATH, JSON.stringify(config, null, 2), {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,
      allowOverwrite: true,
    })
    
    return NextResponse.json({ success: true, url: blob.url })
  } catch (error) {
    console.error('Error saving config:', error)
    return NextResponse.json({ success: false, error: 'Failed to save config' }, { status: 500 })
  }
}
