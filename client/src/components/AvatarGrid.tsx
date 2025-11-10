interface AvatarOption {
  key: string;
  emoji: string;
  label: string;
}

const AVATARS: AvatarOption[] = [
  { key: 'avatar_001', emoji: '🦁', label: 'Lion' },
  { key: 'avatar_002', emoji: '🐱', label: 'Chat' },
  { key: 'avatar_003', emoji: '🐶', label: 'Chien' },
  { key: 'avatar_004', emoji: '🐼', label: 'Panda' },
  { key: 'avatar_005', emoji: '🦊', label: 'Renard' },
  { key: 'avatar_006', emoji: '🐰', label: 'Lapin' },
  { key: 'avatar_007', emoji: '🐻', label: 'Ours' },
  { key: 'avatar_008', emoji: '🐯', label: 'Tigre' },
  { key: 'avatar_009', emoji: '🦄', label: 'Licorne' },
  { key: 'avatar_010', emoji: '🦉', label: 'Hibou' },
  { key: 'avatar_011', emoji: '🐸', label: 'Grenouille' },
  { key: 'avatar_012', emoji: '🦋', label: 'Papillon' },
];

interface AvatarGridProps {
  selectedKey?: string;
  onSelect: (key: string) => void;
}

export default function AvatarGrid({ selectedKey, onSelect }: AvatarGridProps) {
  return (
    <div className="grid grid-cols-4 gap-4">
      {AVATARS.map((avatar) => (
        <button
          key={avatar.key}
          onClick={() => onSelect(avatar.key)}
          className={`card transform transition-all hover:scale-110 ${
            selectedKey === avatar.key
              ? 'ring-4 ring-primary-500 ring-offset-4 scale-105'
              : ''
          }`}
          aria-label={`Avatar ${avatar.label}`}
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-6xl" role="img" aria-label={avatar.label}>
              {avatar.emoji}
            </span>
            <span className="text-child-sm font-bold text-gray-700">
              {avatar.label}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}

export { AVATARS };
