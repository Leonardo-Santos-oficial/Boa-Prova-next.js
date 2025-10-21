import { NavItemData } from './types'

const estadosBrasileiros: NavItemData[] = [
  { id: 'ac', label: 'AC', href: '/concursos/acre' },
  { id: 'al', label: 'AL', href: '/concursos/alagoas' },
  { id: 'ap', label: 'AP', href: '/concursos/amapa' },
  { id: 'am', label: 'AM', href: '/concursos/amazonas' },
  { id: 'ba', label: 'BA', href: '/concursos/bahia' },
  { id: 'ce', label: 'CE', href: '/concursos/ceara' },
  { id: 'df', label: 'DF', href: '/concursos/distrito-federal' },
  { id: 'es', label: 'ES', href: '/concursos/espirito-santo' },
  { id: 'go', label: 'GO', href: '/concursos/goias' },
  { id: 'ma', label: 'MA', href: '/concursos/maranhao' },
  { id: 'mt', label: 'MT', href: '/concursos/mato-grosso' },
  { id: 'ms', label: 'MS', href: '/concursos/mato-grosso-do-sul' },
  { id: 'mg', label: 'MG', href: '/concursos/minas-gerais' },
  { id: 'pa', label: 'PA', href: '/concursos/para' },
  { id: 'pb', label: 'PB', href: '/concursos/paraiba' },
  { id: 'pr', label: 'PR', href: '/concursos/parana' },
  { id: 'pe', label: 'PE', href: '/concursos/pernambuco' },
  { id: 'pi', label: 'PI', href: '/concursos/piaui' },
  { id: 'rj', label: 'RJ', href: '/concursos/rio-de-janeiro' },
  { id: 'rn', label: 'RN', href: '/concursos/rio-grande-do-norte' },
  { id: 'rs', label: 'RS', href: '/concursos/rio-grande-do-sul' },
  { id: 'ro', label: 'RO', href: '/concursos/rondonia' },
  { id: 'rr', label: 'RR', href: '/concursos/roraima' },
  { id: 'sc', label: 'SC', href: '/concursos/santa-catarina' },
  { id: 'sp', label: 'SP', href: '/concursos/sao-paulo' },
  { id: 'se', label: 'SE', href: '/concursos/sergipe' },
  { id: 'to', label: 'TO', href: '/concursos/tocantins' },
]

export const navigationData: NavItemData[] = [
  {
    id: 'estados',
    label: 'Concursos por Estado',
    children: estadosBrasileiros,
  },
  {
    id: 'concursos-nacionais',
    label: 'Concursos Nacionais',
    href: '/concursos-nacionais',
  },
  {
    id: 'oab',
    label: 'OAB',
    href: '/oab',
  },
  {
    id: 'inicio',
    label: 'Início',
    href: '/',
  },
  {
    id: 'quem-somos',
    label: 'Quem somos',
    href: '/quem-somos',
  },
  {
    id: 'concursos-abertos',
    label: 'Concursos abertos ou previstos',
    href: '/concursos-abertos-previstos',
  },
  {
    id: 'artigos',
    label: 'Artigos',
    href: '/artigos',
  },
  {
    id: 'contato',
    label: 'Contato',
    href: '/contato',
  },
  {
    id: 'cursos',
    label: 'Cursos',
    href: '/cursos',
  },
]

