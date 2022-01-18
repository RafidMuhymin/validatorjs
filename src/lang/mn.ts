const mn = {
  accepted: ':attribute баталсан байх шаардлагатай.',
  active_url: ':attribute талбарт зөв URL хаяг оруулна уу.',
  after: ':attribute талбарт :date-с хойш огноо оруулна уу.',
  after_or_equal:
    ':attribute талбарт :date эсвэл түүнээс хойш огноо оруулна уу.',
  alpha: ':attribute талбарт латин үсэг оруулна уу.',
  alpha_dash:
    ':attribute талбарт латин үсэг, тоо болон зураас оруулах боломжтой.',
  alpha_num: ':attribute талбарт латин үсэг болон тоо оруулах боломжтой.',
  attributes: {},
  array: ':attribute талбар массив байх шаардлагатай.',
  before: ':attribute талбарт :date-с өмнөх огноо оруулна уу.',
  before_or_equal:
    ':attribute талбарт :date эсвэл түүнээс өмнөх огноо оруулна уу.',
  between: {
    numeric: ':attribute талбарт :min-:max хооронд тоо оруулна уу.',
    file: ':attribute талбарт :min-:max килобайт хэмжээтэй файл оруулна уу.',
    string: ':attribute талбарт :min-:max урттай текст оруулна уу.',
    array: ':attribute массивт :min-:max элемэнт байх шаардлагатай.',
  },
  boolean: ':attribute талбарын утга үнэн эсвэл худал байх шаардлагатай.',
  confirmed: ':attribute талбарын баталагажуулалт тохирохгүй байна.',
  date: ':attribute талбарт оруулсан огноо буруу байна.',
  date_format: ':attribute талбарт :format хэлбэртэй огноо оруулна уу.',
  different: ':attribute талбарт :other -с өөр утга оруулах шаардлагатай.',
  digits: ':attribute талбарт дараах цифрүүдээс оруулах боломжтой. :digits.',
  digits_between:
    ':attribute талбарт :min-:max хоорондох цифр оруулах боломжтой.',
  dimensions: ':attribute талбарийн зургийн хэмжээс буруу байна.',
  distinct: ':attribute талбарт ялгаатай утга оруулах шаардлагатай.',
  email: ':attribute талбарт зөв и-мэйл хаяг оруулах шаардлагатай.',
  exists: 'Сонгогдсон :attribute буруу байна.',
  file: ':attribute талбарт файл оруулах шаардлагатай.',
  filled: ':attribute талбар шаардлагатай.',
  gt: {
    numeric: 'The :attribute must be greater than :value.',
    file: 'The :attribute must be greater than :value kilobytes.',
    string: 'The :attribute must be greater than :value characters.',
    array: 'The :attribute must have more than :value items.',
  },
  gte: {
    numeric: 'The :attribute must be greater than or equal :value.',
    file: 'The :attribute must be greater than or equal :value kilobytes.',
    string: 'The :attribute must be greater than or equal :value characters.',
    array: 'The :attribute must have :value items or more.',
  },
  hex: 'The :attribute field should have hexadecimal format',
  image: ':attribute талбарт зураг оруулна уу.',
  in: 'Сонгогдсон :attribute буруу байна.',
  in_array: ':attribute талбарт оруулсан утга :other -д байхгүй байна.',
  integer: ':attribute талбарт бүхэл тоо оруулах шаардлагатай.',
  ip: ':attribute талбарт зөв IP хаяг оруулах шаардлагатай.',
  ipv4: 'The :attribute must be a valid IPv4 address.',
  ipv6: 'The :attribute must be a valid IPv6 address.',
  json: ':attribute талбарт зөв JSON тэмдэгт мөр оруулах шаардлагатай.',
  lt: {
    numeric: 'The :attribute must be less than :value.',
    file: 'The :attribute must be less than :value kilobytes.',
    string: 'The :attribute must be less than :value characters.',
    array: 'The :attribute must have less than :value items.',
  },
  lte: {
    numeric: 'The :attribute must be less than or equal :value.',
    file: 'The :attribute must be less than or equal :value kilobytes.',
    string: 'The :attribute must be less than or equal :value characters.',
    array: 'The :attribute must not have more than :value items.',
  },
  max: {
    numeric: ':attribute талбарт :max буюу түүнээс бага утга оруулна уу.',
    file: ':attribute талбарт :max килобайтаас бага хэмжээтэй файл оруулна уу.',
    string: ':attribute талбарт :max-с бага урттай текст оруулна уу.',
    array: ':attribute талбарт хамгийн ихдээ :max элемэнт оруулах боломжтой.',
  },
  mimes: ':attribute талбарт дараах төрлийн файл оруулах боломжтой: :values.',
  mimetypes:
    ':attribute талбарт дараах төрлийн файл оруулах боломжтой: :values.',
  min: {
    numeric: ':attribute талбарт :min буюу түүнээс их тоо оруулна уу.',
    file: ':attribute талбарт :min килобайтаас их хэмжээтэй файл оруулна уу.',
    string:
      ':attribute талбарт :min буюу түүнээс их үсэг бүхий текст оруулна уу.',
    array: ':attribute талбарт хамгийн багадаа :min элемэнт оруулах боломжтой.',
  },
  not_in: 'Буруу :attribute сонгогдсон байна.',
  not_regex: 'The :attribute format is invalid.',
  numeric: ':attribute талбарт тоон утга оруулна уу.',
  present: ':attribute талбар байх шаардлагатай.',
  regex: ':attribute талбарт оруулсан утга буруу байна.',
  required: ':attribute талбар шаардлагатай.',
  required_if:
    'Хэрэв :other :value бол :attribute табларт утга оруулах шаардлагатай.',
  required_unless:
    ':other :values дотор байхгүй бол :attribute талбарт утга оруулах шаардлагатай.',
  required_with:
    ':values утгуудийн аль нэг байвал :attribute талбар шаардлагатай.',
  required_with_all: ':values утгууд байвал :attribute талбар шаардлагатай.',
  required_without:
    'The :attribute field is required when :values is not present.',
  required_without_all:
    'The :attribute field is required when none of :values are present.',
  same: 'The :attribute and :other must match.',
  size: {
    numeric: ':attribute :size хэмжээтэй байх шаардлагатай.',
    file: ':attribute :size килобайт хэмжээтэй байх шаардлагатай.',
    string: ':attribute :size тэмдэгтийн урттай байх шаардлагатай.',
    array: ':attribute :size элемэнттэй байх шаардлагатай.',
  },
  string: ':attribute талбарт текст оруулна уу.',
  timezone: ':attribute талбарт зөв цагийн бүс оруулна уу.',
  unique: 'Оруулсан :attribute аль хэдий нь бүртгэгдсэн байна.',
  uploaded: ':attribute талбарт оруулсан файлыг хуулхад алдаа гарлаа.',
  url: ':attribute зөв url хаяг оруулна уу.',
}

export default mn
