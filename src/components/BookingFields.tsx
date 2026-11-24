import type { ReactNode } from 'react';
import { Camera, MapPin, Minus, Plus, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ItemIcon } from './NanjingVisuals';
import { MAX_BOOKING_PHOTOS } from './useBookingPhotos';
import type { useBookingPhotos } from './useBookingPhotos';

type BookingKind = 'bulky' | 'recyclable';

export function BookingAddressButton({ kind }: { kind: BookingKind }) {
  const { currentAddress, navigate } = useApp();
  const bulky = kind === 'bulky';

  return (
    <button
      onClick={() => navigate({ name: 'address_list', selectMode: true })}
      className="w-full bg-white rounded-xl p-3.5 border border-[#E6E6E1] text-left flex items-center justify-between gap-3"
    >
      {currentAddress ? (
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded ${bulky ? 'bg-[#FDF4EC] text-[#B45309]' : 'bg-[#EDF5F2] text-[#1D6F5A]'}`}>
              {bulky ? '清运地址' : '上门地址'}
            </span>
            <span className="text-[14px] font-semibold text-zinc-900 tabular-nums">
              {currentAddress.contactName} {currentAddress.phone}
            </span>
          </div>
          <p className="text-[12px] text-zinc-500 mt-1 truncate">
            {currentAddress.region} {currentAddress.community} {currentAddress.detail}
          </p>
        </div>
      ) : (
        <span className="text-[14px] font-medium text-rose-700">
          {bulky ? '* 请选择清运地址' : '* 请选择回收地址'}
        </span>
      )}
      <MapPin className={`w-4.5 h-4.5 ${bulky ? 'text-[#B45309]' : 'text-[#1D6F5A]'} shrink-0`} />
    </button>
  );
}

export function BookingTimeSlots({ slots, selected, onSelect, kind }: {
  slots: string[];
  selected: string;
  onSelect: (slot: string) => void;
  kind: BookingKind | 'appliance';
}) {
  const activeStyle = kind === 'bulky'
    ? 'border-[#B45309] bg-[#FDF4EC] text-[#B45309]'
    : 'border-[#1D6F5A] bg-[#EDF5F2] text-[#1D6F5A]';

  return (
    <div className="grid grid-cols-2 gap-2">
      {slots.map((slot) => (
        <button
          key={slot}
          onClick={() => onSelect(slot)}
          className={`py-2 ${kind === 'recyclable' ? 'px-2 ' : ''}rounded-lg text-[12px] font-medium border transition ${selected === slot
            ? activeStyle
            : 'border-[#ECECE8] bg-[#FAFAF8] text-zinc-600'}`}
        >
          {slot}
        </button>
      ))}
    </div>
  );
}

export function BookingItemRow({ id, name, description, quantity, onChange, kind }: {
  id: string;
  name: string;
  description: ReactNode;
  quantity: ReactNode;
  onChange: (delta: number) => void;
  kind: BookingKind;
}) {
  const bulky = kind === 'bulky';
  return (
    <div className="py-2.5 flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-[#F4F4F1] text-zinc-700 flex items-center justify-center">
          <ItemIcon id={id} />
        </div>
        <div>
          <div className="text-[13px] font-medium text-zinc-900">{name}</div>
          <div className={bulky ? 'text-[11px] text-zinc-500' : 'text-[11px] text-zinc-500 tabular-nums'}>
            {description}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onChange(-1)}
          className="w-7 h-7 rounded-lg bg-[#F4F4F1] flex items-center justify-center text-zinc-600"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <span className={`${bulky ? 'w-6' : 'w-10'} text-center text-[13px] font-semibold text-zinc-900 tabular-nums`}>
          {quantity}
        </span>
        <button
          onClick={() => onChange(1)}
          className={`w-7 h-7 rounded-lg ${bulky ? 'bg-[#B45309]' : 'bg-[#1D6F5A]'} text-white flex items-center justify-center`}
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export function BookingPhotosField({ picker, remarks, onRemarksChange, kind }: {
  picker: ReturnType<typeof useBookingPhotos>;
  remarks: string;
  onRemarksChange: (remarks: string) => void;
  kind: BookingKind;
}) {
  const { photos, processingPhotos, addPhotos, removePhoto } = picker;
  const bulky = kind === 'bulky';
  const placeholder = bulky
    ? '请备注物品尺寸、是否需要现场拆解、小区货车进出时段等'
    : '选填：如需要上楼协助搬运、纸箱较多等情况';

  return (
    <div className="bg-white rounded-xl p-3.5 border border-[#E6E6E1] space-y-2.5">
      <div className="text-[13px] font-semibold text-zinc-900">{bulky ? '现场照片（最多 4 张）与备注' : '现场照片与备注'}</div>
      <div className="flex items-center gap-2 flex-wrap">
        {photos.map((src, index) => (
          <div key={index} className={`${bulky ? 'relative ' : ''}w-15 h-15 rounded-lg overflow-hidden border border-[#E6E6E1]`}>
            <img src={src} alt={bulky ? '大件照片' : '上传照片'} className="w-full h-full object-cover" />
            {bulky && (
              <button
                onClick={() => removePhoto(index)}
                className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-zinc-900/75 text-white flex items-center justify-center"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            )}
          </div>
        ))}
        {photos.length < MAX_BOOKING_PHOTOS && (
          <label className="w-15 h-15 rounded-lg border border-dashed border-zinc-300 bg-[#FAFAF8] flex flex-col items-center justify-center text-zinc-400 cursor-pointer">
            <Camera className="w-4.5 h-4.5" />
            <span className="text-[10px] mt-0.5 tabular-nums">{photos.length}/{MAX_BOOKING_PHOTOS}</span>
            <input type="file" accept="image/*" multiple disabled={processingPhotos} onChange={addPhotos} className="hidden" />
          </label>
        )}
      </div>
      {processingPhotos && <p role="status" className="text-[11px] text-zinc-500">正在处理照片…</p>}
      <div className="relative">
        <textarea
          maxLength={200}
          rows={3}
          value={remarks}
          onChange={(event) => onRemarksChange(event.target.value)}
          placeholder={placeholder}
          className={`w-full rounded-lg bg-[#FAFAF8] border border-[#E6E6E1] p-2.5 text-[13px] text-zinc-800 placeholder:text-zinc-400 focus:outline-none ${bulky ? 'focus:border-[#B45309]' : 'focus:border-[#1D6F5A]'} resize-none`}
        />
        <span className="absolute right-2.5 bottom-2 text-[10.5px] text-zinc-400 tabular-nums">
          {remarks.length}/200
        </span>
      </div>
    </div>
  );
}
