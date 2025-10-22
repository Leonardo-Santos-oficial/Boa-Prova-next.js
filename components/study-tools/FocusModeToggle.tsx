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
      aria-label={isActive ? 'Desativar modo foco (Ctrl+F ou F)' : 'Ativar modo foco (Ctrl+F ou F)'}
      aria-pressed={isActive}
      title={isActive ? 'Desativar modo foco (Ctrl+F ou F)' : 'Ativar modo foco (Ctrl+F ou F)'}
    >
      <span className="text-xl" aria-hidden="true">{isActive ? '👁️' : '🎯'}</span>
      <span>{isActive ? 'Sair do Modo Foco' : 'Modo Foco'}</span>
      <span className="sr-only">
        {isActive 
          ? 'Modo foco ativo. Pressione Ctrl+F ou F para desativar.' 
          : 'Modo foco inativo. Pressione Ctrl+F ou F para ativar.'}
      </span>
    </Button>
  )
}
