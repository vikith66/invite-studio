import { type PointerEvent, useEffect, useRef, useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { GlowButton } from '../components/GlowButton';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { Canvas, Image as FabricImage, Line as FabricLine, Textbox, filters } from 'fabric';
import {
  Type,
  Palette,
  Image,
  Layout,
  Undo,
  Redo,
  Download,
  Save,
  ChevronLeft,
  Trash2,
  Upload,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Layers,
} from 'lucide-react';

const weddingBackground = new URL('../../assets/designs/Wedding-1-BG.png', import.meta.url).href;
const ornamentalDivide3Url = new URL('../../assets/designs/Ornamental divide 3.png', import.meta.url).href;
const lineImageUrl = new URL('../../assets/designs/Line.png', import.meta.url).href;

const ORNAMENT_DIVIDER_TOP = 300;
const ORNAMENT_DIVIDER_SCALE_WIDTH = 280;
const ORNAMENT_DIVIDER_HEIGHT = 180;
const LINE_DECORATION_WIDTH = 240;
const FEBRUARY_LINE_DECORATIONS = [
  { top: 930, left: 370, flipX: true },
  { top: 1010, left: 370, flipX: true },
  { top: 930, left: 690, flipX: false },
  { top: 1010, left: 690, flipX: false },
];

const DEFAULT_CANVAS_WIDTH = 1060;
const DEFAULT_CANVAS_HEIGHT = 1484;
const CANVAS_WIDTH_MIN = 320;
const CANVAS_WIDTH_MAX = 5000;
const CANVAS_HEIGHT_MIN = 320;
const CANVAS_HEIGHT_MAX = 7000;

const ORNAMENT_TINTS = {
  gold: '#945D07',
  brown: '#7d5f2b',
  white: '#FFFFFF',
};

type TextBlock = {
  text: string;
  left?: number;
  top: number;
  width: number;
  fontFamily: string;
  fontSize: number;
  fontWeight?: string;
  fontStyle?: 'italic' | 'normal';
  underline?: boolean;
  fill: string;
  textAlign: 'left' | 'center' | 'right';
  lineHeight?: number;
  letterSpacing?: number;
};

type LineDecoration = {
  top: number;
  left: number;
  flipX?: boolean;
};

type EditorTemplateConfig = {
  id: string;
  name: string;
  backgroundImage: string;
  textBlocks: TextBlock[];
  ornamentDivider?: {
    top: number;
    width: number;
    height: number;
  };
  lineDecorations?: LineDecoration[];
  tintColor: string;
};

export function EditorPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const canvasElementRef = useRef<HTMLCanvasElement | null>(null);
  const fabricCanvasRef = useRef<Canvas | null>(null);
  const canvasAreaRef = useRef<HTMLDivElement | null>(null);
  const canvasWrapperRef = useRef<HTMLDivElement | null>(null);
  const ornamentDividerRef = useRef<FabricImage | null>(null);
  const uploadInputRef = useRef<HTMLInputElement | null>(null);
  const isFabricTextEditingRef = useRef(false);
  const isHistoryPausedRef = useRef(false);
  const historyRef = useRef<{ entries: string[]; index: number }>({ entries: [], index: -1 });
  const [selectedTool, setSelectedTool] = useState<'templates' | 'text' | 'images' | 'colors'>('text');
  const [isLeftSidebarCollapsed, setIsLeftSidebarCollapsed] = useState(true);
  const [isRightSidebarCollapsed, setIsRightSidebarCollapsed] = useState(true);
  const [fontFamily, setFontFamily] = useState('Playfair Display');
  const [fontSize, setFontSize] = useState(48);
  const [textColor, setTextColor] = useState('#2D2D2D');
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('center');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [selectedElementKind, setSelectedElementKind] = useState<'text' | 'ornament' | 'image' | null>(null);
  const [selectedElementLabel, setSelectedElementLabel] = useState('');
  const [canvasWidth, setCanvasWidth] = useState(DEFAULT_CANVAS_WIDTH);
  const [canvasHeight, setCanvasHeight] = useState(DEFAULT_CANVAS_HEIGHT);
  const [canvasWidthInput, setCanvasWidthInput] = useState(String(DEFAULT_CANVAS_WIDTH));
  const [canvasHeightInput, setCanvasHeightInput] = useState(String(DEFAULT_CANVAS_HEIGHT));
  const [canvasSizeErrors, setCanvasSizeErrors] = useState<{ width: string; height: string }>({ width: '', height: '' });
  const [selectedElementLeft, setSelectedElementLeft] = useState(DEFAULT_CANVAS_WIDTH / 2);
  const [selectedElementTop, setSelectedElementTop] = useState(0);
  const [selectedElementScale, setSelectedElementScale] = useState(100);
  const [ornamentTintColor, setOrnamentTintColor] = useState(ORNAMENT_TINTS.gold);
  const [ornamentPreviewSrc, setOrnamentPreviewSrc] = useState(ornamentalDivide3Url);
  const [linePreviewSrc, setLinePreviewSrc] = useState(lineImageUrl);
  const [isExporting, setIsExporting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [fontsReady, setFontsReady] = useState(false);
  const [canvasZoom, setCanvasZoom] = useState(1);
  const updateScaleRef = useRef<(() => void) | null>(null);
  const canvasZoomRef = useRef(1);
  const pendingHtmlTextEditsRef = useRef<Record<number, string>>({});
  const [fitScale, setFitScale] = useState(1);

  const fonts = ['Poppins', 'Inter', 'Sora', 'Playfair Display', 'Cardo', 'Calisto MT', 'Montserrat', 'Cormorant Garamond', 'Relicta-Light', 'Infinite Stroke'];
  const presetColors = ['#2D2D2D', '#FFB5A7', '#C7B8EA', '#A7D7F0', '#FFF4B8', '#FFB8D1', '#FFFFFF'];
  const historyExtraProperties = [
    'textBlockIndex',
    'underlineForTextIndex',
    'isTintableDecoration',
    'isTemplateBackground',
    'isUploadedImage',
    'uploadName',
  ];

  const getCanvasFontFamily = (fontFamily: string) => fontFamily;

  const waitForEditorFonts = async () => {
    const fontSet = document.fonts;
    if (!fontSet) return;

    const fontLoads = [
      '22px Cardo',
      '35px Cardo',
      '24px Montserrat',
      '28px italic Montserrat',
      '40px "Cormorant Garamond"',
      '38px 600 "Cormorant Garamond"',
      '72px "Infinite Stroke"',
      '70px 600 "Infinite Stroke"',
      '40px "Relicta-Light"',
      '85px 700 Cardo',
      '50px Cardo',
      '35px 600 "Cormorant Garamond"',
      '30px 500 "Cormorant Garamond"',
      '54px "Great Vibes"',
      '16px Poppins',
      '16px Inter',
      '16px Sora',
    ].map((font) => fontSet.load(font));

    await Promise.allSettled(fontLoads);
    await fontSet.ready;
  };

  useEffect(() => {
    let cancelled = false;

    void waitForEditorFonts().then(() => {
      if (!cancelled) setFontsReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const getTextboxUnderlineLine = (canvas: Canvas, textBlockIndex: number) =>
    canvas
      .getObjects()
      .find((object) => object instanceof FabricLine && (object as any).underlineForTextIndex === textBlockIndex) as FabricLine | undefined;

  const measureRenderedTextWidth = (ctx: CanvasRenderingContext2D, text: string, letterSpacing = 0) => {
    if (!letterSpacing) return ctx.measureText(text).width;

    const chars = [...text];
    return chars.reduce((width, char) => width + ctx.measureText(char).width, 0) + letterSpacing * Math.max(0, chars.length - 1);
  };

  const getTextboxUnderlineGeometry = (textObject: Textbox) => {
    const scaleX = textObject.scaleX ?? 1;
    const scaleY = textObject.scaleY ?? 1;
    const boxWidth = (textObject.width || textObject.getScaledWidth?.() || 0) * scaleX;
    const height = typeof textObject.getScaledHeight === 'function'
      ? textObject.getScaledHeight()
      : (textObject.height || textObject.fontSize || 0) * scaleY;
    const centerX = textObject.left ?? canvasWidth / 2;
    const top = textObject.top ?? 0;
    const y = top + height + Math.max(3, (textObject.fontSize || 18) * 0.08 * scaleY);
    const measureCanvas = document.createElement('canvas');
    const ctx = measureCanvas.getContext('2d');
    const fontSize = textObject.fontSize || 18;
    const fontStyle = textObject.fontStyle || 'normal';
    const fontWeight = textObject.fontWeight || '400';
    const fontFamily = textObject.fontFamily || 'sans-serif';
    const charSpacing = ((textObject.charSpacing || 0) * fontSize) / 1000;
    const rawLines = ((textObject as any).textLines as Array<string | string[]> | undefined) ?? String(textObject.text ?? '').split('\n');
    const lines = rawLines.map((line) => (Array.isArray(line) ? line.join('') : String(line)));
    const measuredWidth = ctx
      ? Math.max(
          0,
          ...lines.map((line) => {
            ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;
            return measureRenderedTextWidth(ctx, line, charSpacing) * scaleX;
          }),
        )
      : boxWidth;
    const width = Math.min(boxWidth, measuredWidth || boxWidth);
    const textAlign = textObject.textAlign || 'left';
    const boxLeft = centerX - boxWidth / 2;
    const x1 =
      textAlign === 'center'
        ? centerX - width / 2
        : textAlign === 'right'
          ? boxLeft + boxWidth - width
          : boxLeft;

    return {
      x1,
      x2: x1 + width,
      y,
      strokeWidth: Math.max(1, ((textObject.fontSize || 18) * scaleY) / 22),
    };
  };

  const updateCustomTextboxUnderline = (canvas: Canvas, textObject: Textbox, shouldUnderline: boolean) => {
    const textBlockIndex = Number((textObject as any).textBlockIndex);
    if (!Number.isInteger(textBlockIndex)) return;

    textObject.set({ underline: false });
    const existingLine = getTextboxUnderlineLine(canvas, textBlockIndex);

    if (!shouldUnderline) {
      if (existingLine) canvas.remove(existingLine);
      return;
    }

    const { x1, x2, y, strokeWidth } = getTextboxUnderlineGeometry(textObject);
    const stroke = typeof textObject.fill === 'string' ? textObject.fill : '#2D2D2D';

    if (existingLine) {
      existingLine.set({ x1, x2, y1: y, y2: y, stroke, strokeWidth });
      existingLine.setCoords();
      return;
    }

    const underlineLine = new FabricLine([x1, y, x2, y], {
      stroke,
      strokeWidth,
      selectable: false,
      evented: false,
      excludeFromExport: false,
    });
    (underlineLine as any).underlineForTextIndex = textBlockIndex;
    canvas.add(underlineLine);
  };

  const applyTintToImage = (image: FabricImage, color: string) => {
    image.filters = [new filters.BlendColor({ color, mode: 'tint', alpha: 1 })];
    if (typeof image.applyFilters === 'function') {
      image.applyFilters();
    }
  };

  const getTintedImageDataUrl = async (url: string, color: string) => {
    const image = await FabricImage.fromURL(url);
    applyTintToImage(image, color);
    return image.toDataURL({ format: 'png', multiplier: 1 });
  };

  // Keep the visible preview and Fabric object tinted from the original transparent PNG.
  useEffect(() => {
    if (isFabricTextEditingRef.current) return;

    let cancelled = false;
    (async () => {
      try {
        const [ornamentDataUrl, lineDataUrl] = await Promise.all([
          getTintedImageDataUrl(ornamentalDivide3Url, ornamentTintColor),
          getTintedImageDataUrl(lineImageUrl, ornamentTintColor),
        ]);
        if (cancelled) return;
        setOrnamentPreviewSrc(ornamentDataUrl);
        setLinePreviewSrc(lineDataUrl);

        const ornament = ornamentDividerRef.current;
        const canvas = fabricCanvasRef.current;
        if (canvas && !isFabricTextEditingRef.current) {
          canvas.getObjects().forEach((object) => {
            if ((object as any).isTintableDecoration && object instanceof FabricImage) {
              applyTintToImage(object, ornamentTintColor);
              object.setCoords();
            }
          });
          if (ornament) ornamentDividerRef.current = ornament;
          canvas.requestRenderAll();
          saveCanvasHistory();
        }
      } catch {
        // ignore failures
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [ornamentTintColor]);

  const invitationTextBlocks: TextBlock[] = [
    {
      text: '|| Shree Sankeshwara Parshwanathaya Namah ||',
      top: 200,
      width: 919,
      fontFamily: 'Cardo',
      fontSize: 22,
      fill: '#2a5030',
      textAlign: 'center',
    },
    {
      text: 'With divine blessings of',
      top: 265,
      width: 636,
      fontFamily: 'Cardo',
      fontSize: 35,
      fill: '#5B4B45',
      textAlign: 'center',
    },
    {
      text: 'Late Smt. Gunvanti Bai & Hastimalji Bhandari',
      top: 315,
      width: 883,
      fontFamily: 'Montserrat',
      fontSize: 24,
      fill: '#2a5030',
      textAlign: 'center',
    },
    {
      text: 'To celebrate the wedding of',
      top: 420,
      width: 636,
      fontFamily: 'Cormorant Garamond',
      fontSize: 40,
      fontWeight: '500',
      fill: '#5B4B45',
      textAlign: 'center',
    },
    {
      text: 'Aditi Barmia',
      top: 490,
      width: 636,
      fontFamily: 'Infinite Stroke',
      fontSize: 72,
      fontWeight: '400',
      fill: '#945D07',
      textAlign: 'center',
    },
    {
      text: '&',
      top: 600,
      width: 177,
      fontFamily: 'Infinite Stroke',
      fontSize: 70,
      fontWeight: '600',
      fill: '#945D07',
      textAlign: 'center',
    },
    {
      text: 'Jayshi Singhai',
      top: 680,
      width: 636,
      fontFamily: 'Infinite Stroke',
      fontSize: 72,
      fontWeight: '400',
      fill: '#945D07',
      textAlign: 'center',
    },
    {
      text: 'We cordially invite you to join us for their ',
      top: 824,
      width: 625,
      fontFamily: 'Montserrat',
      fontSize: 28,
      fontWeight: '400',
      fontStyle: 'italic',
      fill: '#2a5030',
      textAlign: 'center',
    },
    {
      text: 'wedding ceremony on',
      top: 865,
      width: 625,
      fontFamily: 'Montserrat',
      fontSize: 28,
      fontWeight: '400',
      fontStyle: 'italic',
      fill: '#2a5030',
      textAlign: 'center',
    },
    {
      text: 'FEBRUARY',
      top: 940,
      width: 424,
      fontFamily: 'Relicta-Light',
      fontSize: 40,
      fill: '#3A2E2A',
      textAlign: 'center',
      letterSpacing: 6,
    },
    {
      text: 'SUNDAY',
      left: 375,
      top: 1030,
      width: 260,
      fontFamily: 'Cormorant Garamond',
      fontSize: 38,
      fontWeight: '600',
      fill: '#3A2E2A',
      textAlign: 'center',
      letterSpacing: 5,
    },
    {
      text: '09',
      left: 530,
      top: 1010,
      width: 180,
      fontFamily: 'Cardo',
      fontSize: 85,
      fontWeight: '700',
      fill: '#6E7A43',
      textAlign: 'center',
      lineHeight: 0.9,
    },
    {
      text: 'AT 11:30 AM',
      left: 705,
      top: 1030,
      width: 330,
      fontFamily: 'Cardo',
      fontSize: 39,
      fontWeight: '200',
      fill: '#3A2E2A',
      textAlign: 'center',
      letterSpacing: -1,
    },
    {
      text: '2025',
      top: 1110,
      width: 212,
      fontFamily: 'Cardo',
      fontSize: 50,
      fill: '#3A2E2A',
      textAlign: 'center',
    },
    {
      text: 'VENUE:',
      top: 1210,
      width: 265,
      fontFamily: 'Cormorant Garamond',
      fontSize: 27,
      fontWeight: '600',
      fill: '#3A2E2A',
      textAlign: 'center',
    },
    {
      text: 'PRIVE HOTEL,',
      top: 1240,
      width: 389,
      fontFamily: 'Cormorant Garamond',
      fontSize: 35,
      fontWeight: '600',
      fill: '#3A2E2A',
      textAlign: 'center',
    },
    {
      text: 'MYLAPORE, CHENNAI',
      top: 1280,
      width: 389,
      fontFamily: 'Cormorant Garamond',
      fontSize: 35,
      fontWeight: '600',
      fill: '#3A2E2A',
      textAlign: 'center',
    },
    {
      text: 'Awaiting to Welcome you,',
      top: 1340,
      width: 459,
      fontFamily: 'Cormorant Garamond',
      fontSize: 30,
      fontWeight: '500',
      fill: '#5B4B45',
      textAlign: 'center',
    },
  ];

  const createTemplateTextBlocks = (
    title: string,
    subtitle: string,
    hostLine: string,
    eventLine: string,
    primaryName: string,
    secondaryName: string,
    month: string,
    day: string,
    date: string,
    time: string,
    year: string,
    venue: string,
    city: string,
    accent = '#945D07',
  ): TextBlock[] => [
    { ...invitationTextBlocks[0], text: title },
    { ...invitationTextBlocks[1], text: subtitle },
    { ...invitationTextBlocks[2], text: hostLine },
    { ...invitationTextBlocks[3], text: eventLine },
    { ...invitationTextBlocks[4], text: primaryName, fill: accent },
    { ...invitationTextBlocks[5], fill: accent },
    { ...invitationTextBlocks[6], text: secondaryName, fill: accent },
    { ...invitationTextBlocks[7], text: 'We cordially invite you to join us for their ' },
    { ...invitationTextBlocks[8], text: eventLine.toLowerCase().replace('to celebrate the ', '') },
    { ...invitationTextBlocks[9], text: month },
    { ...invitationTextBlocks[10], text: day },
    { ...invitationTextBlocks[11], text: date },
    { ...invitationTextBlocks[12], text: time },
    { ...invitationTextBlocks[13], text: year },
    { ...invitationTextBlocks[14] },
    { ...invitationTextBlocks[15], text: venue },
    { ...invitationTextBlocks[16], text: city },
    { ...invitationTextBlocks[17] },
  ];

  const editorTemplateConfigs: Record<string, EditorTemplateConfig> = {
    'elegant-wedding': {
      id: 'elegant-wedding',
      name: 'Elegant Wedding',
      backgroundImage: weddingBackground,
      textBlocks: invitationTextBlocks,
      ornamentDivider: {
        top: ORNAMENT_DIVIDER_TOP,
        width: ORNAMENT_DIVIDER_SCALE_WIDTH,
        height: ORNAMENT_DIVIDER_HEIGHT,
      },
      lineDecorations: FEBRUARY_LINE_DECORATIONS,
      tintColor: ORNAMENT_TINTS.gold,
    },
    'modern-engagement': {
      id: 'modern-engagement',
      name: 'Modern Engagement',
      backgroundImage: weddingBackground,
      textBlocks: createTemplateTextBlocks(
        'With love and joy',
        'Together with their families',
        'Anaya Mehta & Rohan Shah',
        'To celebrate the engagement of',
        'Anaya Mehta',
        'Rohan Shah',
        'MARCH',
        'SATURDAY',
        '15',
        'AT 06:00 PM',
        '2026',
        'THE ORCHID HALL,',
        'MUMBAI',
        '#7A4EC2',
      ),
      ornamentDivider: { top: 285, width: 240, height: 155 },
      lineDecorations: FEBRUARY_LINE_DECORATIONS,
      tintColor: '#7A4EC2',
    },
    'sweet-baby-shower': {
      id: 'sweet-baby-shower',
      name: 'Sweet Baby Shower',
      backgroundImage: weddingBackground,
      textBlocks: createTemplateTextBlocks(
        'A little blessing is on the way',
        'Please join us for a',
        'Baby Shower honoring Neha',
        'To celebrate the arrival of',
        'Baby Mehra',
        'With Love',
        'APRIL',
        'SUNDAY',
        '20',
        'AT 04:30 PM',
        '2026',
        'BLOOM BANQUET,',
        'BENGALURU',
        '#4B8FB8',
      ),
      ornamentDivider: { top: 285, width: 220, height: 145 },
      lineDecorations: FEBRUARY_LINE_DECORATIONS,
      tintColor: '#4B8FB8',
    },
    'reception-party': {
      id: 'reception-party',
      name: 'Reception Party',
      backgroundImage: weddingBackground,
      textBlocks: createTemplateTextBlocks(
        'Celebrating new beginnings',
        'You are warmly invited',
        'With blessings from both families',
        'To celebrate the reception of',
        'Kiara Rao',
        'Arjun Nair',
        'MAY',
        'FRIDAY',
        '22',
        'AT 07:30 PM',
        '2026',
        'GRAND IMPERIAL,',
        'HYDERABAD',
        '#A46A22',
      ),
      ornamentDivider: { top: 300, width: 260, height: 165 },
      lineDecorations: FEBRUARY_LINE_DECORATIONS,
      tintColor: '#A46A22',
    },
    'royal-wedding': {
      id: 'royal-wedding',
      name: 'Royal Wedding',
      backgroundImage: weddingBackground,
      textBlocks: createTemplateTextBlocks(
        'By the grace of the almighty',
        'With divine blessings of',
        'The Malhotra and Kapoor families',
        'To celebrate the wedding of',
        'Isha Malhotra',
        'Dev Kapoor',
        'DECEMBER',
        'MONDAY',
        '08',
        'AT 11:00 AM',
        '2026',
        'PALACE COURTYARD,',
        'JAIPUR',
        '#8D5A12',
      ),
      ornamentDivider: { top: 295, width: 300, height: 190 },
      lineDecorations: FEBRUARY_LINE_DECORATIONS,
      tintColor: '#8D5A12',
    },
    'diamond-engagement': {
      id: 'diamond-engagement',
      name: 'Diamond Engagement',
      backgroundImage: weddingBackground,
      textBlocks: createTemplateTextBlocks(
        'Two hearts, one promise',
        'Families invite you to bless',
        'Ritika Jain & Kabir Soni',
        'To celebrate the engagement of',
        'Ritika Jain',
        'Kabir Soni',
        'JUNE',
        'THURSDAY',
        '18',
        'AT 05:00 PM',
        '2026',
        'CRYSTAL ROOM,',
        'DELHI',
        '#6F55B5',
      ),
      ornamentDivider: { top: 285, width: 230, height: 150 },
      lineDecorations: FEBRUARY_LINE_DECORATIONS,
      tintColor: '#6F55B5',
    },
    'baby-boy-shower': {
      id: 'baby-boy-shower',
      name: 'Baby Boy Shower',
      backgroundImage: weddingBackground,
      textBlocks: createTemplateTextBlocks(
        'Tiny hands, big dreams',
        'Please join us for a',
        'Baby shower celebration',
        'To celebrate the arrival of',
        'Baby Arora',
        'With Joy',
        'JULY',
        'SUNDAY',
        '12',
        'AT 03:30 PM',
        '2026',
        'SKY BLUE HALL,',
        'PUNE',
        '#3D86B8',
      ),
      ornamentDivider: { top: 285, width: 220, height: 145 },
      lineDecorations: FEBRUARY_LINE_DECORATIONS,
      tintColor: '#3D86B8',
    },
    'garden-reception': {
      id: 'garden-reception',
      name: 'Garden Reception',
      backgroundImage: weddingBackground,
      textBlocks: createTemplateTextBlocks(
        'An evening under the stars',
        'Join us for a garden reception',
        'With love from our families',
        'To celebrate the reception of',
        'Meera Iyer',
        'Aditya Menon',
        'AUGUST',
        'SATURDAY',
        '29',
        'AT 07:00 PM',
        '2026',
        'THE GREENHOUSE,',
        'KOCHI',
        '#4C7A3A',
      ),
      ornamentDivider: { top: 300, width: 250, height: 160 },
      lineDecorations: FEBRUARY_LINE_DECORATIONS,
      tintColor: '#4C7A3A',
    },
    'beach-wedding': {
      id: 'beach-wedding',
      name: 'Beach Wedding',
      backgroundImage: weddingBackground,
      textBlocks: createTemplateTextBlocks(
        'Where the sea meets forever',
        'Together with their families',
        'You are invited with love',
        'To celebrate the wedding of',
        'Tara Dsouza',
        'Neil Fernandes',
        'NOVEMBER',
        'WEDNESDAY',
        '19',
        'AT 05:45 PM',
        '2026',
        'SEASIDE RESORT,',
        'GOA',
        '#2F8D9D',
      ),
      ornamentDivider: { top: 295, width: 245, height: 155 },
      lineDecorations: FEBRUARY_LINE_DECORATIONS,
      tintColor: '#2F8D9D',
    },
    'romantic-engagement': {
      id: 'romantic-engagement',
      name: 'Romantic Engagement',
      backgroundImage: weddingBackground,
      textBlocks: createTemplateTextBlocks(
        'A promise made in love',
        'Please join us as we celebrate',
        'The beginning of forever',
        'To celebrate the engagement of',
        'Rhea Shah',
        'Aman Verma',
        'SEPTEMBER',
        'SUNDAY',
        '06',
        'AT 06:30 PM',
        '2026',
        'ROSEWOOD LOUNGE,',
        'AHMEDABAD',
        '#B4588E',
      ),
      ornamentDivider: { top: 285, width: 235, height: 150 },
      lineDecorations: FEBRUARY_LINE_DECORATIONS,
      tintColor: '#B4588E',
    },
    'baby-girl-shower': {
      id: 'baby-girl-shower',
      name: 'Baby Girl Shower',
      backgroundImage: weddingBackground,
      textBlocks: createTemplateTextBlocks(
        'A sweet little princess is coming',
        'Please join us for a',
        'Baby shower celebration',
        'To celebrate the arrival of',
        'Baby Khanna',
        'With Love',
        'OCTOBER',
        'SATURDAY',
        '10',
        'AT 04:00 PM',
        '2026',
        'BLUSH BANQUET,',
        'CHANDIGARH',
        '#C05B88',
      ),
      ornamentDivider: { top: 285, width: 220, height: 145 },
      lineDecorations: FEBRUARY_LINE_DECORATIONS,
      tintColor: '#C05B88',
    },
    'evening-reception': {
      id: 'evening-reception',
      name: 'Evening Reception',
      backgroundImage: weddingBackground,
      textBlocks: createTemplateTextBlocks(
        'Dinner, music, and celebration',
        'We request your gracious presence',
        'With blessings from our families',
        'To celebrate the reception of',
        'Sanya Bose',
        'Ritvik Sen',
        'JANUARY',
        'FRIDAY',
        '23',
        'AT 08:00 PM',
        '2027',
        'THE LUMIERE,',
        'KOLKATA',
        '#5A4FA3',
      ),
      ornamentDivider: { top: 300, width: 255, height: 165 },
      lineDecorations: FEBRUARY_LINE_DECORATIONS,
      tintColor: '#5A4FA3',
    },
  };

  const templateAliases: Record<string, string> = {
    'Wedding-1-BG': 'elegant-wedding',
  };
  const requestedTemplateId = searchParams.get('template') ?? 'elegant-wedding';
  const selectedTemplateId = templateAliases[requestedTemplateId] ?? requestedTemplateId;
  const activeTemplate = editorTemplateConfigs[selectedTemplateId] ?? editorTemplateConfigs['elegant-wedding'];
  const activeTextBlocks = activeTemplate.textBlocks;
  const activeOrnamentDivider = activeTemplate.ornamentDivider;
  const activeLineDecorations = activeTemplate.lineDecorations ?? [];
  const activeTemplateSignature = JSON.stringify(activeTemplate);

  const [canvasTextBlocks, setCanvasTextBlocks] = useState(activeTextBlocks);
  const [selectedTextIndex, setSelectedTextIndex] = useState(4);
  const dragStateRef = useRef<{
    index: number;
    pointerId: number;
    startX: number;
    startY: number;
    startLeft: number;
    startTop: number;
  } | null>(null);

  const selectTextBlock = (index: number) => {
    const block = canvasTextBlocks[index];
    setSelectedTextIndex(index);
    setSelectedElementKind('text');
    setSelectedElementLabel('Text element');
    setSelectedElementLeft(Math.round(block.left ?? canvasWidth / 2));
    setSelectedElementTop(block.top);
    setSelectedElementScale(100);
    setFontFamily(block.fontFamily);
    setFontSize(block.fontSize);
    setTextColor(block.fill);
    setTextAlign(block.textAlign);
    setIsBold(block.fontWeight === 'bold' || Number(block.fontWeight) >= 600);
    setIsItalic(block.fontStyle === 'italic');
    setIsUnderline(Boolean(block.underline));
  };

  const updateSelectedTextBlock = (updates: Partial<TextBlock>) => {
    setCanvasTextBlocks((blocks) =>
      blocks.map((block, index) => (index === selectedTextIndex ? { ...block, ...updates } : block)),
    );

    if (isFabricTextEditingRef.current) return;

    const canvas = fabricCanvasRef.current;
    const activeObject = canvas?.getActiveObject();
    if (!(activeObject instanceof Textbox)) return;

    const nextShouldUnderline = updates.underline ?? Boolean(canvas && getTextboxUnderlineLine(canvas, Number((activeObject as any).textBlockIndex)));
    const fabricUpdates: Record<string, unknown> = { ...updates };
    delete fabricUpdates.underline;
    if (updates.fontFamily) {
      fabricUpdates.fontFamily = getCanvasFontFamily(updates.fontFamily);
    }
    activeObject.set(fabricUpdates);
    if (updates.underline !== undefined || updates.fontSize || updates.fontFamily || updates.fill || updates.fontWeight || updates.fontStyle) {
      updateCustomTextboxUnderline(canvas, activeObject, nextShouldUnderline);
    }
    activeObject.setCoords();
    canvas?.requestRenderAll();
    saveCanvasHistory();
  };

  const commitHtmlTextEdit = (index: number) => {
    const nextText = pendingHtmlTextEditsRef.current[index];
    if (typeof nextText !== 'string') return;

    delete pendingHtmlTextEditsRef.current[index];
    setCanvasTextBlocks((blocks) =>
      blocks.map((item, itemIndex) => (itemIndex === index ? { ...item, text: nextText } : item)),
    );
  };

  useEffect(() => {
    if (isFabricTextEditingRef.current) return;

    pendingHtmlTextEditsRef.current = {};
    setCanvasTextBlocks(activeTextBlocks);
    setOrnamentTintColor(activeTemplate.tintColor);

    const selectedBlock = activeTextBlocks[selectedTextIndex] ?? activeTextBlocks[0];
    if (!selectedBlock) return;

    setSelectedElementLeft(Math.round(selectedBlock.left ?? canvasWidth / 2));
    setSelectedElementTop(selectedBlock.top);
    setSelectedElementScale(100);
    setFontFamily(selectedBlock.fontFamily);
    setFontSize(selectedBlock.fontSize);
    setTextColor(selectedBlock.fill);
    setTextAlign(selectedBlock.textAlign);
    setIsBold(selectedBlock.fontWeight === 'bold' || Number(selectedBlock.fontWeight) >= 600);
    setIsItalic(selectedBlock.fontStyle === 'italic');
    setIsUnderline(Boolean(selectedBlock.underline));
  }, [activeTemplateSignature]);

  const refreshHistoryAvailability = () => {
    setCanUndo(historyRef.current.index > 0);
    setCanRedo(historyRef.current.index >= 0 && historyRef.current.index < historyRef.current.entries.length - 1);
  };

  const syncCanvasTextBlocksFromFabric = (canvas: Canvas) => {
    const nextBlocks = activeTextBlocks.map((block) => ({ ...block }));

    canvas.getObjects().forEach((object) => {
      if (!(object instanceof Textbox)) return;

      const index = Number((object as any).textBlockIndex);
      if (!Number.isInteger(index) || !nextBlocks[index]) return;

      nextBlocks[index] = {
        ...nextBlocks[index],
        text: object.text ?? '',
        left: Math.round(object.left ?? nextBlocks[index].left ?? canvasWidth / 2),
        top: Math.round(object.top ?? nextBlocks[index].top),
        width: Math.round(object.width ?? nextBlocks[index].width),
        fontFamily: object.fontFamily || nextBlocks[index].fontFamily,
        fontSize: object.fontSize || nextBlocks[index].fontSize,
        fontWeight: String(object.fontWeight ?? nextBlocks[index].fontWeight ?? '400'),
        fontStyle: (object.fontStyle as TextBlock['fontStyle']) || nextBlocks[index].fontStyle,
        underline: Boolean(getTextboxUnderlineLine(canvas, index)),
        fill: typeof object.fill === 'string' ? object.fill : nextBlocks[index].fill,
        textAlign: (object.textAlign as TextBlock['textAlign']) || nextBlocks[index].textAlign,
        lineHeight: object.lineHeight || nextBlocks[index].lineHeight,
        letterSpacing: object.charSpacing ? (object.charSpacing * (object.fontSize || nextBlocks[index].fontSize)) / 1000 : nextBlocks[index].letterSpacing,
      };
    });

    setCanvasTextBlocks(nextBlocks);
  };

  const configureFabricObject = (object: any) => {
    if ((object as any).isTemplateBackground) {
      object.set({ selectable: false, evented: false, originX: 'left', originY: 'top' });
      return;
    }

    if ((object as any).underlineForTextIndex !== undefined) {
      object.set({ selectable: false, evented: false, excludeFromExport: false });
      return;
    }

    if (object instanceof Textbox) {
      object.set({
        selectable: true,
        evented: true,
        hasBorders: true,
        transparentCorners: false,
        cornerColor: '#C7B8EA',
        borderColor: '#C7B8EA',
        padding: 2,
      });
      return;
    }

    if (object.type === 'image') {
      object.set({
        selectable: true,
        evented: true,
        hasBorders: true,
        hasControls: true,
        lockUniScaling: false,
        transparentCorners: false,
        cornerColor: '#C7B8EA',
        borderColor: '#C7B8EA',
      });
    }
  };

  const configureCanvasObjectsAfterLoad = (canvas: Canvas) => {
    ornamentDividerRef.current = null;

    canvas.getObjects().forEach((object) => {
      configureFabricObject(object);
      if ((object as any).isTintableDecoration && object.type === 'image' && !ornamentDividerRef.current) {
        ornamentDividerRef.current = object as FabricImage;
      }
    });

    syncCanvasTextBlocksFromFabric(canvas);
    syncTextControlsFromActiveObject();
    syncSelectedElementControlsFromActiveObject();
    canvas.requestRenderAll();
  };

  const getCanvasHistorySnapshot = (canvas: Canvas) =>
    JSON.stringify({
      width: canvas.getWidth(),
      height: canvas.getHeight(),
      canvas: canvas.toJSON(historyExtraProperties),
    });

  const saveCanvasHistory = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || isHistoryPausedRef.current) return;

    const snapshot = getCanvasHistorySnapshot(canvas);
    const { entries, index } = historyRef.current;
    if (entries[index] === snapshot) return;

    const nextEntries = entries.slice(0, index + 1);
    nextEntries.push(snapshot);
    const trimmedEntries = nextEntries.slice(-80);
    historyRef.current = { entries: trimmedEntries, index: trimmedEntries.length - 1 };
    refreshHistoryAvailability();
  };

  const loadCanvasHistoryAt = async (nextIndex: number) => {
    const canvas = fabricCanvasRef.current;
    const snapshot = historyRef.current.entries[nextIndex];
    if (!canvas || !snapshot) return;

    const parsedSnapshot = JSON.parse(snapshot);
    isHistoryPausedRef.current = true;
    canvas.discardActiveObject();
    canvas.setDimensions({ width: parsedSnapshot.width ?? canvasWidth, height: parsedSnapshot.height ?? canvasHeight });
    setCanvasWidth(parsedSnapshot.width ?? canvasWidth);
    setCanvasHeight(parsedSnapshot.height ?? canvasHeight);
    await canvas.loadFromJSON(parsedSnapshot.canvas ?? parsedSnapshot);
    historyRef.current.index = nextIndex;
    configureCanvasObjectsAfterLoad(canvas);
    isHistoryPausedRef.current = false;
    refreshHistoryAvailability();
  };

  const undoCanvasChange = () => {
    if (!canUndo) return;
    void loadCanvasHistoryAt(historyRef.current.index - 1);
  };

  const redoCanvasChange = () => {
    if (!canRedo) return;
    void loadCanvasHistoryAt(historyRef.current.index + 1);
  };

  const removeActiveObject = () => {
    const canvas = fabricCanvasRef.current;
    const activeObject = canvas?.getActiveObject();
    if (!canvas || !activeObject || (activeObject as any).isTemplateBackground) return;

    const objectsToRemove =
      activeObject.type === 'activeselection' && typeof (activeObject as any).forEachObject === 'function'
        ? (() => {
            const objects: any[] = [];
            (activeObject as any).forEachObject((object: any) => objects.push(object));
            return objects;
          })()
        : [activeObject];

    objectsToRemove.forEach((object) => {
      if ((object as any).isTemplateBackground) return;

      if (object instanceof Textbox) {
        const textBlockIndex = Number((object as any).textBlockIndex);
        const underlineLine = Number.isInteger(textBlockIndex) ? getTextboxUnderlineLine(canvas, textBlockIndex) : undefined;
        if (underlineLine) canvas.remove(underlineLine);
      }

      canvas.remove(object);
    });
    canvas.discardActiveObject();
    syncCanvasTextBlocksFromFabric(canvas);
    syncSelectedElementControlsFromActiveObject();
    canvas.requestRenderAll();
    saveCanvasHistory();
  };

  const handleImageUpload = async (file: File | undefined) => {
    if (!file) return;

    const allowedTypes = ['image/png', 'image/jpeg', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) return;
    if (file.size > 10 * 1024 * 1024) return;

    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    setIsUploadingImage(true);
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(reader.error ?? new Error('Failed to read uploaded image.'));
        reader.readAsDataURL(file);
      });

      const image = await FabricImage.fromURL(dataUrl);
      const maxWidth = canvasWidth * 0.42;
      const maxHeight = canvasHeight * 0.32;
      const scale = Math.min(maxWidth / (image.width || maxWidth), maxHeight / (image.height || maxHeight), 1);

      image.set({
        left: canvasWidth / 2,
        top: canvasHeight / 2,
        originX: 'center',
        originY: 'center',
        scaleX: scale,
        scaleY: scale,
      });
      (image as any).isUploadedImage = true;
      (image as any).uploadName = file.name;
      configureFabricObject(image);

      canvas.add(image);
      canvas.setActiveObject(image);
      syncSelectedElementControlsFromActiveObject();
      canvas.requestRenderAll();
      saveCanvasHistory();
    } finally {
      setIsUploadingImage(false);
      if (uploadInputRef.current) uploadInputRef.current.value = '';
    }
  };

  const beginTextDrag = (event: PointerEvent<HTMLButtonElement>, index: number) => {
    event.preventDefault();
    event.stopPropagation();

    const block = canvasTextBlocks[index];
    const startLeft = block.left ?? canvasWidth / 2;
    const startTop = block.top;

    selectTextBlock(index);
    dragStateRef.current = {
      index,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startLeft,
      startTop,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const moveTextDrag = (event: PointerEvent<HTMLButtonElement>) => {
    const dragState = dragStateRef.current;
    if (!dragState || dragState.pointerId !== event.pointerId) return;

    const zoomScale = Math.max(0.01, fitScale * canvasZoom);
    const nextLeft = Math.round(dragState.startLeft + (event.clientX - dragState.startX) / zoomScale);
    const nextTop = Math.round(dragState.startTop + (event.clientY - dragState.startY) / zoomScale);

    setCanvasTextBlocks((blocks) =>
      blocks.map((block, index) =>
        index === dragState.index
          ? {
              ...block,
              left: Math.min(canvasWidth, Math.max(0, nextLeft)),
              top: Math.min(canvasHeight, Math.max(0, nextTop)),
            }
          : block,
      ),
    );
    setSelectedElementLeft(Math.min(canvasWidth, Math.max(0, nextLeft)));
    setSelectedElementTop(Math.min(canvasHeight, Math.max(0, nextTop)));
  };

  const endTextDrag = (event: PointerEvent<HTMLButtonElement>) => {
    const dragState = dragStateRef.current;
    if (!dragState || dragState.pointerId !== event.pointerId) return;

    dragStateRef.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const syncTextControlsFromActiveObject = () => {
    if (isFabricTextEditingRef.current) return;

    const canvas = fabricCanvasRef.current;
    const activeObject = canvas?.getActiveObject();
    if (!(activeObject instanceof Textbox)) return;

    setFontFamily(activeObject.fontFamily || 'Playfair Display');
    setFontSize(activeObject.fontSize || 48);
    setTextColor(typeof activeObject.fill === 'string' ? activeObject.fill : '#2D2D2D');
    setTextAlign((activeObject.textAlign as 'left' | 'center' | 'right') || 'center');
    setIsBold(activeObject.fontWeight === 'bold' || Number(activeObject.fontWeight) >= 600);
    setIsItalic(activeObject.fontStyle === 'italic');
    const textBlockIndex = Number((activeObject as any).textBlockIndex);
    setIsUnderline(Number.isInteger(textBlockIndex) ? Boolean(getTextboxUnderlineLine(canvas, textBlockIndex)) : Boolean(activeObject.underline));
  };

  const syncSelectedElementControlsFromActiveObject = () => {
    if (isFabricTextEditingRef.current) return;

    const canvas = fabricCanvasRef.current;
    const activeObject = canvas?.getActiveObject();
    const ornamentDivider = ornamentDividerRef.current;

    if (!canvas || !activeObject) {
      setSelectedElementKind(null);
      setSelectedElementLabel('');
      return;
    }

    const isImage = activeObject.type === 'image';
    const isUploadedImage = Boolean((activeObject as any).isUploadedImage);
    const isOrnament = activeObject === ornamentDivider || (isImage && !isUploadedImage);
    setSelectedElementKind(isUploadedImage ? 'image' : isOrnament ? 'ornament' : activeObject instanceof Textbox ? 'text' : null);
    setSelectedElementLabel(isUploadedImage ? 'Uploaded image' : isOrnament ? 'Image element' : activeObject instanceof Textbox ? 'Text element' : '');
    setSelectedElementLeft(Math.round(activeObject.left ?? canvasWidth / 2));
    setSelectedElementTop(Math.round(activeObject.top ?? 0));
    setSelectedElementScale(Math.round((activeObject.scaleX ?? 1) * 100));
  };

  const updateActiveTextObject = (updater: (activeObject: Textbox, canvas: Canvas) => void) => {
    if (isFabricTextEditingRef.current) return;

    const canvas = fabricCanvasRef.current;
    const activeObject = canvas?.getActiveObject();
    if (!canvas || !(activeObject instanceof Textbox)) return;

    updater(activeObject, canvas);
    activeObject.setCoords();
    canvas.requestRenderAll();
    saveCanvasHistory();
  };

  const updateActiveObject = (updater: (obj: any, canvas: Canvas) => void) => {
    if (isFabricTextEditingRef.current) return;

    const canvas = fabricCanvasRef.current;
    const activeObject = canvas?.getActiveObject();
    if (!canvas || !activeObject) return;

    updater(activeObject, canvas);
    activeObject.setCoords();
    canvas.requestRenderAll();
    saveCanvasHistory();
  };

  const updateCanvasDimensions = (updates: Partial<{ width: number; height: number }>) => {
    const requestedWidth = Number.isFinite(updates.width) ? updates.width : canvasWidth;
    const requestedHeight = Number.isFinite(updates.height) ? updates.height : canvasHeight;
    const nextWidth = Math.round(Math.min(CANVAS_WIDTH_MAX, Math.max(CANVAS_WIDTH_MIN, requestedWidth ?? canvasWidth)));
    const nextHeight = Math.round(Math.min(CANVAS_HEIGHT_MAX, Math.max(CANVAS_HEIGHT_MIN, requestedHeight ?? canvasHeight)));
    const canvas = fabricCanvasRef.current;

    setCanvasWidth(nextWidth);
    setCanvasHeight(nextHeight);

    if (canvas) {
      canvas.setDimensions({ width: nextWidth, height: nextHeight });
      canvas.calcOffset();
      canvas.requestRenderAll();
      saveCanvasHistory();
    }

    setSelectedElementLeft((value) => Math.min(nextWidth, value));
    setSelectedElementTop((value) => Math.min(nextHeight, value));
    updateScaleRef.current?.();
  };

  const validateCanvasDimensionInput = (dimension: 'width' | 'height', rawValue: string) => {
    const trimmedValue = rawValue.trim();
    const min = dimension === 'width' ? CANVAS_WIDTH_MIN : CANVAS_HEIGHT_MIN;
    const max = dimension === 'width' ? CANVAS_WIDTH_MAX : CANVAS_HEIGHT_MAX;

    if (!trimmedValue) {
      return `Enter a ${dimension} value.`;
    }

    const parsedValue = Number(trimmedValue);
    if (!Number.isFinite(parsedValue)) {
      return `Enter a valid ${dimension} number.`;
    }

    const roundedValue = Math.round(parsedValue);
    if (roundedValue < min || roundedValue > max) {
      return `Can't change ${dimension} to this size. Use ${min}-${max}px.`;
    }

    return null;
  };

  const applyCanvasDimensionInput = (dimension: 'width' | 'height', rawValue: string) => {
    const validationMessage = validateCanvasDimensionInput(dimension, rawValue);
    setCanvasSizeErrors((prev) => ({
      ...prev,
      [dimension]: validationMessage ?? '',
    }));

    if (validationMessage) return;

    const roundedValue = Math.round(Number(rawValue));
    if (dimension === 'width') {
      updateCanvasDimensions({ width: roundedValue });
      return;
    }

    updateCanvasDimensions({ height: roundedValue });
  };

  useEffect(() => {
    setCanvasWidthInput(String(canvasWidth));
  }, [canvasWidth]);

  useEffect(() => {
    setCanvasHeightInput(String(canvasHeight));
  }, [canvasHeight]);

  useEffect(() => {
    if (!fontsReady) return;

    const canvasEl = canvasElementRef.current;
    if (!canvasEl) return;

    const canvas = new Canvas(canvasEl, {
      width: canvasWidth,
      height: canvasHeight,
      backgroundColor: '#ffffff',
      renderOnAddRemove: true,
      preserveObjectStacking: true,
      selection: true,
    });

    const fabricElements = (canvas as any).elements;
    fabricElements?.container?.style?.setProperty('background-color', 'transparent', 'important');
    fabricElements?.lower?.el?.style?.setProperty('background-color', 'transparent', 'important');
    fabricElements?.upper?.el?.style?.setProperty('background-color', 'transparent', 'important');

    fabricCanvasRef.current = canvas;
    isHistoryPausedRef.current = true;
    historyRef.current = { entries: [], index: -1 };
    refreshHistoryAvailability();
    let cancelled = false;

    const renderCanvasWhenIdle = () => {
      if (cancelled || isFabricTextEditingRef.current) return;
      canvas.renderAll();
    };

    const requestRenderCanvasWhenIdle = () => {
      if (cancelled || isFabricTextEditingRef.current) return;
      canvas.requestRenderAll();
    };

    const syncTextBlockFromFabricObject = (textObject: Textbox) => {
      const objectIndex = Number((textObject as any).textBlockIndex);
      if (!Number.isInteger(objectIndex)) return;

      const nextText = textObject.text ?? '';
      setCanvasTextBlocks((blocks) =>
        blocks.map((block, index) =>
          index === objectIndex
            ? {
                ...block,
                text: nextText,
                left: Math.round(textObject.left ?? block.left ?? canvasWidth / 2),
                top: Math.round(textObject.top ?? block.top),
                width: Math.round(textObject.width ?? block.width),
                fontFamily: textObject.fontFamily || block.fontFamily,
                fontSize: textObject.fontSize || block.fontSize,
                fontWeight: String(textObject.fontWeight ?? block.fontWeight ?? '400'),
                fontStyle: (textObject.fontStyle as TextBlock['fontStyle']) || block.fontStyle,
                underline: Boolean(getTextboxUnderlineLine(canvas, objectIndex)),
                fill: typeof textObject.fill === 'string' ? textObject.fill : block.fill,
                textAlign: (textObject.textAlign as TextBlock['textAlign']) || block.textAlign,
                lineHeight: textObject.lineHeight || block.lineHeight,
                letterSpacing: textObject.charSpacing ? (textObject.charSpacing * (textObject.fontSize || block.fontSize)) / 1000 : block.letterSpacing,
              }
            : block,
        ),
      );
    };

    const handleSelectionChange = () => {
      const activeObject = canvas.getActiveObject();
      if (isFabricTextEditingRef.current || (activeObject instanceof Textbox && activeObject.isEditing)) return;

      if (activeObject instanceof Textbox) {
        const textBlockIndex = Number((activeObject as any).textBlockIndex);
        const textBlock = Number.isInteger(textBlockIndex) ? canvasTextBlocks[textBlockIndex] : undefined;
        updateCustomTextboxUnderline(canvas, activeObject, Boolean(textBlock?.underline ?? getTextboxUnderlineLine(canvas, textBlockIndex)));
      }

      syncTextControlsFromActiveObject();
      syncSelectedElementControlsFromActiveObject();
    };

    const handleObjectModified = (event: any) => {
      const target = event?.target;
      if (target instanceof Textbox) {
        syncTextBlockFromFabricObject(target);
        const textBlockIndex = Number((target as any).textBlockIndex);
        updateCustomTextboxUnderline(canvas, target, Boolean(getTextboxUnderlineLine(canvas, textBlockIndex)));
      }

      handleSelectionChange();
      saveCanvasHistory();
    };

    const handleTextEditingEntered = () => {
      isFabricTextEditingRef.current = true;
    };

    const handleTextEditingExited = (event: any) => {
      const target = event?.target;
      isFabricTextEditingRef.current = false;

      if (target instanceof Textbox) {
        syncTextBlockFromFabricObject(target);
        const textBlockIndex = Number((target as any).textBlockIndex);
        const textBlock = Number.isInteger(textBlockIndex) ? canvasTextBlocks[textBlockIndex] : undefined;
        updateCustomTextboxUnderline(canvas, target, Boolean(textBlock?.underline ?? getTextboxUnderlineLine(canvas, textBlockIndex)));
      }

      syncTextControlsFromActiveObject();
      syncSelectedElementControlsFromActiveObject();
      canvas.requestRenderAll();
      saveCanvasHistory();
    };

    const handleDeleteKey = (event: KeyboardEvent) => {
      if (event.key !== 'Delete' && event.key !== 'Backspace') return;
      const activeElement = document.activeElement;
      if (
        activeElement instanceof HTMLInputElement ||
        activeElement instanceof HTMLTextAreaElement ||
        activeElement instanceof HTMLSelectElement ||
        activeElement?.getAttribute('contenteditable') === 'true'
      ) {
        return;
      }

      const activeObject = canvas.getActiveObject();
      if (!activeObject || (activeObject as any).isTemplateBackground) return;

      event.preventDefault();
      removeActiveObject();
    };

    canvas.on('selection:created', handleSelectionChange);
    canvas.on('selection:updated', handleSelectionChange);
    canvas.on('selection:cleared', () => {
      if (isFabricTextEditingRef.current) return;

      setSelectedElementKind(null);
      setSelectedElementLabel('');
    });
    canvas.on('object:modified', handleObjectModified);
    canvas.on('object:moving', handleSelectionChange);
    canvas.on('object:scaling', handleSelectionChange);
    canvas.on('object:rotating', handleSelectionChange);
    canvas.on('text:editing:entered', handleTextEditingEntered);
    canvas.on('text:editing:exited', handleTextEditingExited);
    window.addEventListener('keydown', handleDeleteKey);

    const loadCanvas = async () => {
      const invitationTextObjects = activeTextBlocks.map((block, index) => {
        const textObject = new Textbox(block.text, {
          left: block.left ?? canvasWidth / 2,
          top: block.top,
          originX: 'center',
          originY: 'top',
          width: block.width,
          fontFamily: getCanvasFontFamily(block.fontFamily),
          fontSize: block.fontSize,
          fontWeight: block.fontWeight ?? '400',
          fontStyle: block.fontStyle ?? 'normal',
          underline: false,
          textAlign: block.textAlign,
          fill: block.fill,
          lineHeight: block.lineHeight ?? 1.2,
          charSpacing: block.letterSpacing ? (block.letterSpacing / block.fontSize) * 1000 : 0,
          editable: true,
          hasBorders: true,
          transparentCorners: false,
          cornerColor: '#C7B8EA',
          borderColor: '#C7B8EA',
          padding: 2,
        });

        (textObject as any).textBlockIndex = index;
        configureFabricObject(textObject);
        return textObject;
      });

      canvas.add(...invitationTextObjects);
      invitationTextObjects.forEach((textObject, index) => {
        updateCustomTextboxUnderline(canvas, textObject, Boolean(activeTextBlocks[index]?.underline));
      });
      if (!isFabricTextEditingRef.current) {
        canvas.setActiveObject(invitationTextObjects[4]);
      }
      syncTextControlsFromActiveObject();
      syncSelectedElementControlsFromActiveObject();
      renderCanvasWhenIdle();

      try {
        const bgImage = await FabricImage.fromURL(activeTemplate.backgroundImage);
        if (cancelled) return;

        bgImage.set({ left: 0, top: 0 });
        (bgImage as any).isTemplateBackground = true;
        configureFabricObject(bgImage);
        const bgScale = Math.min(canvasWidth / (bgImage.width || 1), canvasHeight / (bgImage.height || 1));
        bgImage.scale(bgScale);
        canvas.insertAt(0, bgImage);
        renderCanvasWhenIdle();
      } catch {
        // ignore
      }

      try {
        if (activeOrnamentDivider) {
          const ornamentalDivider = await FabricImage.fromURL(ornamentalDivide3Url);
          if (!cancelled) {
          ornamentalDivider.set({
            selectable: true,
            evented: true,
            originX: 'center',
            originY: 'top',
            left: canvasWidth / 2,
            top: activeOrnamentDivider.top,
          });
          const ornamentScale = activeOrnamentDivider.width / (ornamentalDivider.width || 1);
          ornamentalDivider.set({ scaleX: ornamentScale, scaleY: ornamentScale });
          applyTintToImage(ornamentalDivider, activeTemplate.tintColor);
          (ornamentalDivider as any).isTintableDecoration = true;
          configureFabricObject(ornamentalDivider);
          ornamentDividerRef.current = ornamentalDivider;
          canvas.add(ornamentalDivider);
          renderCanvasWhenIdle();
          }
        }
      } catch (e) {
        // ignore recolor failures
      }

      try {
        if (activeLineDecorations.length) {
          const lineImages = await Promise.all(activeLineDecorations.map(() => FabricImage.fromURL(lineImageUrl)));

        const configureLine = (img: FabricImage, top: number, left: number, flipX = false) => {
          img.set({ selectable: true, evented: true, originX: 'center', originY: 'top', left, top });
          const scale = LINE_DECORATION_WIDTH / (img.width || 1);
          img.set({ scaleX: scale, scaleY: scale, flipX });
          applyTintToImage(img, activeTemplate.tintColor);
          (img as any).isTintableDecoration = true;
          configureFabricObject(img);
          canvas.add(img);
          renderCanvasWhenIdle();
        };

        if (!cancelled) {
          lineImages.forEach((lineImage, index) => {
            const line = activeLineDecorations[index];
            if (line) configureLine(lineImage, line.top, line.left, line.flipX);
          });
        }
        }
      } catch {
        // ignore
      }

      renderCanvasWhenIdle();
      isHistoryPausedRef.current = false;
      saveCanvasHistory();

      const updateScale = () => {
        const area = canvasAreaRef.current;
        const wrapper = canvasWrapperRef.current;

        if (!area || !wrapper) return;

        const availableWidth = Math.max(32, area.clientWidth - 32);
        const availableHeight = Math.max(32, area.clientHeight - 32);
        const fitScale = Math.min(availableWidth / canvasWidth, availableHeight / canvasHeight, 1);
        setFitScale(fitScale);
      };

      updateScaleRef.current = updateScale;
      updateScale();
      const resizeObserver = new ResizeObserver(updateScale);
      if (canvasAreaRef.current) {
        resizeObserver.observe(canvasAreaRef.current);
      }
      window.addEventListener('resize', updateScale);

      (canvas as any).__cleanup = () => {
        resizeObserver.disconnect();
        window.removeEventListener('resize', updateScale);
      };
    };

    void loadCanvas();

    return () => {
      cancelled = true;
      const cleanup = (canvas as any).__cleanup;
      if (typeof cleanup === 'function') cleanup();
      canvas.off('selection:created', handleSelectionChange);
      canvas.off('selection:updated', handleSelectionChange);
      canvas.off('selection:cleared');
      canvas.off('object:modified', handleObjectModified);
      canvas.off('object:moving', handleSelectionChange);
      canvas.off('object:scaling', handleSelectionChange);
      canvas.off('object:rotating', handleSelectionChange);
      canvas.off('text:editing:entered', handleTextEditingEntered);
      canvas.off('text:editing:exited', handleTextEditingExited);
      window.removeEventListener('keydown', handleDeleteKey);
      canvas.dispose();
      fabricCanvasRef.current = null;
      ornamentDividerRef.current = null;
    };
  }, [activeTemplateSignature, fontsReady]);

  useEffect(() => {
    canvasZoomRef.current = canvasZoom;
    updateScaleRef.current?.();
  }, [canvasZoom]);

  useEffect(() => {
    const updateScale = () => {
      const area = canvasAreaRef.current;
      if (!area) return;

      const availableWidth = Math.max(32, area.clientWidth - 64);
      const availableHeight = Math.max(32, area.clientHeight - 64);
      const nextFitScale = Math.min(availableWidth / canvasWidth, availableHeight / canvasHeight, 1);
      setFitScale(nextFitScale);
    };

    updateScaleRef.current = updateScale;
    updateScale();

    const resizeObserver = new ResizeObserver(updateScale);
    if (canvasAreaRef.current) {
      resizeObserver.observe(canvasAreaRef.current);
    }

    window.addEventListener('resize', updateScale);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateScale);
      if (updateScaleRef.current === updateScale) {
        updateScaleRef.current = null;
      }
    };
  }, [canvasWidth, canvasHeight]);

  // When sidebars change (open/close), re-fit the canvas to the available area.
  useEffect(() => {
    updateScaleRef.current?.();
  }, [isLeftSidebarCollapsed, isRightSidebarCollapsed]);

  const handleZoomChange = (nextZoom: number) => {
    const clampedZoom = Math.min(2.5, Math.max(0.35, nextZoom));
    setCanvasZoom(clampedZoom);
  };

  const resetCanvasZoom = () => {
    setCanvasZoom(1);
  };

  const loadExportImage = (src: string) =>
    new Promise<HTMLImageElement>((resolve, reject) => {
      const image = document.createElement('img');
      image.crossOrigin = 'anonymous';
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error(`Failed to load ${src}`));
      image.src = src;
    });

  const drawTextLine = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    align: TextBlock['textAlign'],
    letterSpacing = 0,
  ) => {
    if (!letterSpacing) {
      ctx.textAlign = align;
      ctx.fillText(text, x, y);
      return;
    }

    const chars = [...text];
    const textWidth =
      chars.reduce((width, char) => width + ctx.measureText(char).width, 0) + letterSpacing * Math.max(0, chars.length - 1);
    let currentX = align === 'center' ? x - textWidth / 2 : align === 'right' ? x - textWidth : x;

    ctx.textAlign = 'left';
    chars.forEach((char) => {
      ctx.fillText(char, currentX, y);
      currentX += ctx.measureText(char).width + letterSpacing;
    });
  };

  const measureTextLineWidth = (ctx: CanvasRenderingContext2D, text: string, letterSpacing = 0) => {
    return measureRenderedTextWidth(ctx, text, letterSpacing);
  };

  const drawTextUnderline = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    align: TextBlock['textAlign'],
    fontSize: number,
    letterSpacing = 0,
  ) => {
    const underlineY = y + fontSize + Math.max(2, fontSize * 0.06);
    const width = measureTextLineWidth(ctx, text, letterSpacing);
    const lineLeft = align === 'center' ? x - width / 2 : align === 'right' ? x - width : x;

    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = String(ctx.fillStyle);
    ctx.lineWidth = Math.max(1, fontSize / 22);
    ctx.moveTo(lineLeft, underlineY);
    ctx.lineTo(lineLeft + width, underlineY);
    ctx.stroke();
    ctx.restore();
  };

  const drawExportTextBlock = (ctx: CanvasRenderingContext2D, block: TextBlock, exportScale: number) => {
    const fontSize = block.fontSize * exportScale;
    const boxLeft = ((block.left ?? canvasWidth / 2) - block.width / 2) * exportScale;
    const alignX =
      block.textAlign === 'left'
        ? boxLeft
        : block.textAlign === 'right'
          ? boxLeft + block.width * exportScale
          : boxLeft + (block.width * exportScale) / 2;
    const lineHeight = fontSize * (block.lineHeight ?? 1.2);

    ctx.save();
    ctx.fillStyle = block.fill;
    ctx.textBaseline = 'top';
    ctx.font = `${block.fontStyle ?? 'normal'} ${block.fontWeight ?? '400'} ${fontSize}px ${getCanvasFontFamily(block.fontFamily)}`;

    const lines = block.text.split('\n');
    lines.forEach((line, lineIndex) => {
      const lineTop = (block.top * exportScale) + lineIndex * lineHeight;
      const letterSpacing = (block.letterSpacing ?? 0) * exportScale;
      drawTextLine(
        ctx,
        line,
        alignX,
        lineTop,
        block.textAlign,
        letterSpacing,
      );
      if (block.underline) {
        drawTextUnderline(ctx, line, alignX, lineTop, block.textAlign, fontSize, letterSpacing);
      }
    });
    ctx.restore();
  };

  const downloadCanvasImage = async (format: 'png' | 'jpeg' = 'png') => {
    if (isExporting) return;

    setIsExporting(true);
    try {
      await document.fonts?.ready;
      const canvas = fabricCanvasRef.current;
      if (!canvas) return;

      const dataUrl = canvas.toDataURL({
        format,
        quality: 0.96,
        multiplier: 3,
        enableRetinaScaling: true,
      });
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `invite-studio-${Date.now()}.${format === 'jpeg' ? 'jpg' : 'png'}`;
      link.click();
    } finally {
      setIsExporting(false);
    }
  };

  const renderCanvasSizeControls = () => (
    <GlassCard className="p-4 bg-white/60 space-y-3">
      <div>
        <div className="text-sm text-gray-600 mb-1">Canvas Size</div>
        <div className="text-gray-900 font-medium">{canvasWidth} x {canvasHeight} px</div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <label className="space-y-1 text-sm font-medium text-gray-700">
          <span>Width</span>
          <input
            type="number"
            min={CANVAS_WIDTH_MIN}
            max={CANVAS_WIDTH_MAX}
            value={canvasWidthInput}
            onChange={(event) => {
              const nextValue = event.target.value;
              setCanvasWidthInput(nextValue);
              applyCanvasDimensionInput('width', nextValue);
            }}
            onBlur={() => applyCanvasDimensionInput('width', canvasWidthInput)}
            onKeyDown={(event) => {
              if (event.key !== 'Enter') return;
              applyCanvasDimensionInput('width', canvasWidthInput);
            }}
            aria-invalid={Boolean(canvasSizeErrors.width)}
            className={`w-full rounded-xl border bg-white px-3 py-2 outline-none focus:ring-2 ${
              canvasSizeErrors.width
                ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                : 'border-gray-200 focus:border-[#C7B8EA] focus:ring-[#C7B8EA]/20'
            }`}
          />
          {canvasSizeErrors.width ? <p className="text-xs text-red-600">{canvasSizeErrors.width}</p> : null}
        </label>
        <label className="space-y-1 text-sm font-medium text-gray-700">
          <span>Height</span>
          <input
            type="number"
            min={CANVAS_HEIGHT_MIN}
            max={CANVAS_HEIGHT_MAX}
            value={canvasHeightInput}
            onChange={(event) => {
              const nextValue = event.target.value;
              setCanvasHeightInput(nextValue);
              applyCanvasDimensionInput('height', nextValue);
            }}
            onBlur={() => applyCanvasDimensionInput('height', canvasHeightInput)}
            onKeyDown={(event) => {
              if (event.key !== 'Enter') return;
              applyCanvasDimensionInput('height', canvasHeightInput);
            }}
            aria-invalid={Boolean(canvasSizeErrors.height)}
            className={`w-full rounded-xl border bg-white px-3 py-2 outline-none focus:ring-2 ${
              canvasSizeErrors.height
                ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                : 'border-gray-200 focus:border-[#C7B8EA] focus:ring-[#C7B8EA]/20'
            }`}
          />
          {canvasSizeErrors.height ? <p className="text-xs text-red-600">{canvasSizeErrors.height}</p> : null}
        </label>
      </div>
    </GlassCard>
  );

  const handleToolSelect = (toolId: typeof selectedTool) => {
    if (toolId === 'templates') {
      navigate('/templates');
      return;
    }

    setSelectedTool(toolId);
  };

  return (
    <div className="h-screen bg-gradient-to-br from-[#FFF8F0] via-[#FEFDFB] to-[#F5F0FF] flex flex-col overflow-hidden">
      <div className="border-b border-gray-200 bg-white/60 backdrop-blur-xl">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link to="/templates" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
              <ChevronLeft className="w-5 h-5" />
              Back
            </Link>
            <div className="w-px h-6 bg-gray-200" />
            <span className="text-xl font-bold font-heading bg-gradient-to-r from-[#C7B8EA] via-[#FFB5A7] to-[#A7D7F0] bg-clip-text text-transparent">
              InviteStudio Editor
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={undoCanvasChange}
              disabled={!canUndo}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors disabled:cursor-not-allowed disabled:opacity-40"
              title="Undo"
              aria-label="Undo"
            >
              <Undo className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={redoCanvasChange}
              disabled={!canRedo}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors disabled:cursor-not-allowed disabled:opacity-40"
              title="Redo"
              aria-label="Redo"
            >
              <Redo className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={removeActiveObject}
              disabled={!selectedElementKind}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors disabled:cursor-not-allowed disabled:opacity-40"
              title="Delete selected"
              aria-label="Delete selected"
            >
              <Trash2 className="w-5 h-5 text-gray-600" />
            </button>
            <div className="w-px h-6 bg-gray-200" />
            <div className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white/70 px-3 py-2">
              <button
                onClick={() => handleZoomChange(canvasZoom - 0.1)}
                className="rounded-lg px-2 py-1 text-gray-700 hover:bg-gray-100 transition-colors"
                title="Zoom out"
                aria-label="Zoom out"
              >
                -
              </button>
              <input
                type="range"
                min="0.35"
                max="2.5"
                step="0.05"
                value={canvasZoom}
                onChange={(e) => handleZoomChange(Number(e.target.value))}
                className="w-28 accent-[#C7B8EA]"
                aria-label="Canvas zoom"
              />
              <button
                onClick={() => handleZoomChange(canvasZoom + 0.1)}
                className="rounded-lg px-2 py-1 text-gray-700 hover:bg-gray-100 transition-colors"
                title="Zoom in"
                aria-label="Zoom in"
              >
                +
              </button>
              <button
                onClick={resetCanvasZoom}
                className="rounded-lg px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                title="Reset zoom"
              >
                {Math.round((canvasZoom * fitScale) * 100)}%
              </button>
            </div>
            <div className="w-px h-6 bg-gray-200" />
            <GlowButton variant="ghost" size="sm">
              <Save className="w-4 h-4 mr-2" />
              Save
            </GlowButton>
            <GlowButton variant="primary" size="sm" onClick={() => void downloadCanvasImage('png')}>
              <Download className="w-4 h-4 mr-2" />
              {isExporting ? 'Exporting...' : 'Download PNG'}
            </GlowButton>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className={`${isLeftSidebarCollapsed ? 'w-16' : 'w-80'} border-r border-gray-200 bg-white/40 backdrop-blur-xl overflow-y-auto transition-all duration-300 shrink-0`}>
          <div className="p-4 border-b border-gray-200 flex items-center justify-between gap-3">
            {!isLeftSidebarCollapsed && <h3 className="text-lg font-bold font-heading text-gray-900">Tools</h3>}
            <button
              onClick={() => setIsLeftSidebarCollapsed((value) => !value)}
              className="p-2 rounded-xl hover:bg-white/70 transition-colors text-gray-600 hover:text-gray-900"
              title={isLeftSidebarCollapsed ? 'Open left sidebar' : 'Close left sidebar'}
              aria-label={isLeftSidebarCollapsed ? 'Open left sidebar' : 'Close left sidebar'}
            >
              <ChevronLeft className={`w-5 h-5 transition-transform ${isLeftSidebarCollapsed ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {!isLeftSidebarCollapsed ? (
            <div className="p-6 space-y-6">
              <div className="space-y-3">
                {[
                  { id: 'templates', icon: Layout, label: 'Templates' },
                  { id: 'text', icon: Type, label: 'Text' },
                  { id: 'images', icon: Image, label: 'Uploads' },
                  { id: 'colors', icon: Palette, label: 'Colors' },
                ].map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => handleToolSelect(tool.id as typeof selectedTool)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-medium ${selectedTool === tool.id ? 'bg-gradient-to-r from-[#C7B8EA]/20 to-[#A7D7F0]/20 border border-[#C7B8EA]/30 text-gray-900' : 'bg-white/50 border border-gray-200 text-gray-700 hover:bg-white hover:border-gray-300'}`}
                  >
                    <tool.icon className="w-5 h-5" />
                    <span>{tool.label}</span>
                  </button>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-6">
                {selectedTool === 'text' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold font-heading text-gray-900">Text Properties</h3>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Font Family</label>
                      <select
                        value={fontFamily}
                        onChange={(e) => {
                          const nextFontFamily = e.target.value;
                          setFontFamily(nextFontFamily);
                          updateSelectedTextBlock({ fontFamily: nextFontFamily });
                        }}
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-2xl focus:border-[#C7B8EA] focus:ring-2 focus:ring-[#C7B8EA]/20 outline-none"
                      >
                        {fonts.map((font) => <option key={font} value={font}>{font}</option>)}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Font Size: {fontSize}px</label>
                      <input
                        type="range"
                        min="12"
                        max="120"
                        value={fontSize}
                        onChange={(e) => {
                          const nextFontSize = Number(e.target.value);
                          setFontSize(nextFontSize);
                          updateSelectedTextBlock({ fontSize: nextFontSize });
                        }}
                        className="w-full accent-[#C7B8EA]"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Text Formatting</label>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            const nextIsBold = !isBold;
                            setIsBold(nextIsBold);
                            updateSelectedTextBlock({ fontWeight: nextIsBold ? '700' : '400' });
                          }}
                          className={`flex-1 p-2.5 border rounded-xl transition-colors ${isBold ? 'border-[#C7B8EA] bg-[#C7B8EA]/10' : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'}`}
                          aria-pressed={isBold}
                          title="Bold"
                        >
                          <Bold className="w-4 h-4 mx-auto text-gray-700" />
                        </button>
                        <button
                          onClick={() => {
                            const nextIsItalic = !isItalic;
                            setIsItalic(nextIsItalic);
                            updateSelectedTextBlock({ fontStyle: nextIsItalic ? 'italic' : 'normal' });
                          }}
                          className={`flex-1 p-2.5 border rounded-xl transition-colors ${isItalic ? 'border-[#C7B8EA] bg-[#C7B8EA]/10' : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'}`}
                          aria-pressed={isItalic}
                          title="Italic"
                        >
                          <Italic className="w-4 h-4 mx-auto text-gray-700" />
                        </button>
                        <button
                          onClick={() => {
                            const nextIsUnderline = !isUnderline;
                            setIsUnderline(nextIsUnderline);
                            updateSelectedTextBlock({ underline: nextIsUnderline });
                          }}
                          className={`flex-1 p-2.5 border rounded-xl transition-colors ${isUnderline ? 'border-[#C7B8EA] bg-[#C7B8EA]/10' : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'}`}
                          aria-pressed={isUnderline}
                          title="Underline"
                        >
                          <Underline className="w-4 h-4 mx-auto text-gray-700" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Alignment</label>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setTextAlign('left');
                            updateSelectedTextBlock({ textAlign: 'left' });
                          }}
                          className={`flex-1 p-2.5 bg-white border rounded-xl transition-colors ${textAlign === 'left' ? 'border-[#C7B8EA] bg-[#C7B8EA]/10' : 'border-gray-200 hover:bg-gray-50 hover:border-gray-300'}`}
                        >
                          <AlignLeft className="w-4 h-4 mx-auto text-gray-700" />
                        </button>
                        <button
                          onClick={() => {
                            setTextAlign('center');
                            updateSelectedTextBlock({ textAlign: 'center' });
                          }}
                          className={`flex-1 p-2.5 bg-white border rounded-xl transition-colors ${textAlign === 'center' ? 'border-[#C7B8EA] bg-[#C7B8EA]/10' : 'border-gray-200 hover:bg-gray-50 hover:border-gray-300'}`}
                        >
                          <AlignCenter className="w-4 h-4 mx-auto text-gray-700" />
                        </button>
                        <button
                          onClick={() => {
                            setTextAlign('right');
                            updateSelectedTextBlock({ textAlign: 'right' });
                          }}
                          className={`flex-1 p-2.5 bg-white border rounded-xl transition-colors ${textAlign === 'right' ? 'border-[#C7B8EA] bg-[#C7B8EA]/10' : 'border-gray-200 hover:bg-gray-50 hover:border-gray-300'}`}
                        >
                          <AlignRight className="w-4 h-4 mx-auto text-gray-700" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {selectedTool === 'colors' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold font-heading text-gray-900">Color Palette</h3>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Text Color</label>
                      <div className="flex flex-wrap gap-2">
                        {presetColors.map((color) => (
                          <button
                            key={color}
                            onClick={() => {
                              setTextColor(color);
                              updateSelectedTextBlock({ fill: color });
                            }}
                            className={`w-12 h-12 rounded-xl border-2 transition-all ${textColor === color ? 'border-[#C7B8EA] scale-110 shadow-lg' : 'border-gray-200'}`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Custom Color</label>
                      <input
                        type="color"
                        value={textColor}
                        onChange={(e) => {
                          const nextColor = e.target.value;
                          setTextColor(nextColor);
                          updateSelectedTextBlock({ fill: nextColor });
                        }}
                        className="w-full h-12 rounded-2xl cursor-pointer border border-gray-200"
                      />
                    </div>
                  </div>
                )}

                {selectedTool === 'images' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold font-heading text-gray-900">Upload Images</h3>
                    <label className="block cursor-pointer">
                      <GlassCard className="p-8 text-center hover:bg-white/60 transition-all border-2 border-dashed border-gray-300">
                        <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-600 font-medium">{isUploadingImage ? 'Uploading...' : 'Click to upload'}</p>
                        <p className="text-sm text-gray-500 mt-2">PNG, JPG, SVG up to 10MB</p>
                      </GlassCard>
                      <input
                        ref={uploadInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/svg+xml"
                        className="sr-only"
                        onChange={(event) => void handleImageUpload(event.target.files?.[0])}
                      />
                    </label>
                  </div>
                )}

                {selectedTool === 'templates' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold font-heading text-gray-900">Quick Templates</h3>
                    <div className="space-y-2">
                      {['Classic Wedding', 'Modern Minimal', 'Elegant Floral', 'Romantic Style'].map((template, index) => (
                        <button key={index} className="w-full p-4 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all text-left font-medium text-gray-700">
                          {template}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-3 space-y-3 flex flex-col items-center">
              {[
                { id: 'templates', icon: Layout, label: 'Templates' },
                { id: 'text', icon: Type, label: 'Text' },
                { id: 'images', icon: Image, label: 'Uploads' },
                { id: 'colors', icon: Palette, label: 'Colors' },
              ].map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => handleToolSelect(tool.id as typeof selectedTool)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${selectedTool === tool.id ? 'bg-[#C7B8EA]/20 text-gray-900' : 'bg-white/60 text-gray-600 hover:bg-white hover:text-gray-900'}`}
                  title={tool.label}
                  aria-label={tool.label}
                >
                  <tool.icon className="w-5 h-5" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div
          ref={canvasAreaRef}
          className="flex-1 overflow-auto bg-[#f5f5f7] flex items-start justify-center p-8"
        >
          {/** Keep layout dimensions tied to scaled size; do not let transformed canvas inflate flow height. */}
          <div
            className="flex items-start justify-center"
            style={{
              width: canvasWidth * (fitScale * canvasZoom),
              height: canvasHeight * (fitScale * canvasZoom),
            }}
          >
            <div
              className="relative overflow-hidden shadow-2xl"
              style={{
                width: canvasWidth * (fitScale * canvasZoom),
                height: canvasHeight * (fitScale * canvasZoom),
              }}
            >
              <div
                ref={canvasWrapperRef}
                className="absolute left-0 top-0"
                style={{
                  width: canvasWidth,
                  height: canvasHeight,
                  transform: `scale(${fitScale * canvasZoom})`,
                  transformOrigin: 'top left',
                }}
              >
                <GlassCard className="w-full h-full flex items-center justify-center relative shadow-2xl overflow-hidden">
                  <div
                    className="relative overflow-hidden bg-white"
                    style={{ width: canvasWidth, height: canvasHeight }}
                  >
                    <canvas
                      ref={canvasElementRef}
                      width={canvasWidth}
                      height={canvasHeight}
                      className="block"
                    />
                  </div>
                </GlassCard>
              </div>
            </div>
          </div>
        </div>

        <div className={`${isRightSidebarCollapsed ? 'w-16' : 'w-64'} border-l border-gray-200 bg-white/40 backdrop-blur-xl transition-all duration-300 shrink-0`}>
          <div className="p-4 border-b border-gray-200 flex items-center justify-between gap-3">
            {!isRightSidebarCollapsed && (
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-bold font-heading text-gray-900">Properties</h3>
              </div>
            )}
            <button
              onClick={() => setIsRightSidebarCollapsed((value) => !value)}
              className="p-2 rounded-xl hover:bg-white/70 transition-colors text-gray-600 hover:text-gray-900"
              title={isRightSidebarCollapsed ? 'Open right sidebar' : 'Close right sidebar'}
              aria-label={isRightSidebarCollapsed ? 'Open right sidebar' : 'Close right sidebar'}
            >
              <ChevronLeft className={`w-5 h-5 transition-transform ${isRightSidebarCollapsed ? '' : 'rotate-180'}`} />
            </button>
          </div>

          {!isRightSidebarCollapsed ? (
            <div className="p-6 space-y-4">
              {selectedElementKind ? (
                <>
                <GlassCard className="p-4 bg-white/60 space-y-4">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Element Properties</div>
                    <div className="text-gray-900 font-medium">{selectedElementLabel}</div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Position X: {selectedElementLeft}px</label>
                    <input
                      type="range"
                      min="0"
                      max={canvasWidth}
                      value={selectedElementLeft}
                      onChange={(e) => {
                        const nextLeft = Number(e.target.value);
                        setSelectedElementLeft(nextLeft);
                        if (selectedElementKind === 'text') {
                          updateSelectedTextBlock({ left: nextLeft });
                        } else {
                          updateActiveObject((object) => object.set({ left: nextLeft }));
                        }
                      }}
                      className="w-full accent-[#C7B8EA]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Position Y: {selectedElementTop}px</label>
                    <input
                      type="range"
                      min="0"
                      max={canvasHeight}
                      value={selectedElementTop}
                      onChange={(e) => {
                        const nextTop = Number(e.target.value);
                        setSelectedElementTop(nextTop);
                        if (selectedElementKind === 'text') {
                          updateSelectedTextBlock({ top: nextTop });
                        } else {
                          updateActiveObject((object) => object.set({ top: nextTop }));
                        }
                      }}
                      className="w-full accent-[#C7B8EA]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Scale: {selectedElementScale}%</label>
                    <input
                      type="range"
                      min="25"
                      max="250"
                      value={selectedElementScale}
                      onChange={(e) => {
                        const nextScale = Number(e.target.value);
                        setSelectedElementScale(nextScale);
                        if (selectedElementKind === 'text') {
                          const baseFontSize = activeTextBlocks[selectedTextIndex]?.fontSize ?? fontSize;
                          const nextFontSize = Math.max(8, Math.round(baseFontSize * (nextScale / 100)));
                          setFontSize(nextFontSize);
                          updateSelectedTextBlock({ fontSize: nextFontSize });
                        } else {
                          updateActiveObject((object) => object.set({ scaleX: nextScale / 100, scaleY: nextScale / 100 }));
                        }
                      }}
                      className="w-full accent-[#C7B8EA]"
                    />
                  </div>

                  {selectedElementKind === 'ornament' && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Fill / Tint Color</label>
                      <input
                        type="color"
                        value={ornamentTintColor}
                        onChange={(e) => setOrnamentTintColor(e.target.value)}
                        className="w-full h-12 rounded-2xl cursor-pointer border border-gray-200"
                      />
                    </div>
                  )}
                </GlassCard>
                {renderCanvasSizeControls()}
                </>
              ) : (
                <>
                  {renderCanvasSizeControls()}
                  <GlassCard className="p-4 bg-white/60">
                    <div className="text-sm text-gray-600 mb-1">Orientation</div>
                    <div className="text-gray-900 font-medium">Portrait</div>
                  </GlassCard>
                  <GlassCard className="p-4 bg-white/60">
                    <div className="text-sm text-gray-600 mb-1">Format</div>
                    <div className="text-gray-900 font-medium">PNG / PDF</div>
                  </GlassCard>
                  <GlassCard className="p-4 bg-white/60">
                    <div className="text-sm text-gray-600 mb-1">Quality</div>
                    <div className="text-gray-900 font-medium">High (300 DPI)</div>
                  </GlassCard>
                </>
              )}
            </div>
          ) : (
            <div className="p-3 flex items-center justify-center">
              <Layers className="w-5 h-5 text-gray-600" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


