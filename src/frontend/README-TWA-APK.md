# Building an Android APK using Trusted Web Activity (TWA)

This guide explains how to wrap your deployed Provision Store PWA into an Android APK using Trusted Web Activity (TWA).

## Overview

**Important:** The APK created using this method is a wrapper around your hosted web app. The Internet Computer app remains hosted on the web, and the APK simply loads it in a native Android container. No code runs natively on the device—all functionality comes from the deployed web app.

## Prerequisites

1. **Android Studio** installed on your computer ([Download here](https://developer.android.com/studio))
2. Your PWA deployed and accessible via HTTPS (e.g., `https://your-canister-id.ic0.app`)
3. Basic familiarity with Android Studio

## Step-by-Step Instructions

### 1. Install Bubblewrap CLI (Recommended Method)

The easiest way to create a TWA is using Google's Bubblewrap tool:

