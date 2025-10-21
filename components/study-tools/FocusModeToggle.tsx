import Button from '@/components/core/Button'
import { useFocusMode } from '@/contexts/FocusModeContext'

export default function FocusModeToggle() {
  const { isActive, toggle } = useFocusMode()

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggle}
      className="flex items-center space-x-2"
      aria-label={isActive ? 'Desativar modo foco' : 'Ativar modo foco'}
    >
      <span className="text-xl">{isActive ? '👁️' : '🎯'}</span>
      <span>{isActive ? 'Sair do Modo Foco' : 'Modo Foco'}</span>
    </Button>
  )
}
