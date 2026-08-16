package com.android.car.ui.plugin.oemapis.recyclerview

import android.content.Context
import android.graphics.drawable.Drawable
import android.util.AttributeSet

interface LayoutStyleOEMV1 {
    fun getSpanCount(): Int
    fun getLayoutType(): Int
    fun getOrientation(): Int
    fun getReverseLayout(): Boolean
}

class RecyclerViewAttributesOEMV1(context: Context, attrs: AttributeSet?) {
    
    fun isRotaryScrollEnabled(): Boolean = false
    fun getSize(): Int = -1
    fun getLayoutStyle(): LayoutStyleOEMV1? = null
    fun getLayoutWidth(): Int = 0
    fun getLayoutHeight(): Int = 0
    fun geMinWidth(): Int = 0 // Note: Kept the 'geMinWidth' typo from your Java snippet
    fun getMinHeight(): Int = 0
    fun getPaddingLeft(): Int = 0
    fun getPaddingRight(): Int = 0
    fun getPaddingTop(): Int = 0
    fun getPaddingBottom(): Int = 0
    fun getMarginLeft(): Int = 0
    fun getMarginRight(): Int = 0
    fun getMarginTop(): Int = 0
    fun getMarginBottom(): Int = 0
    fun getBackground(): Drawable? = null
}