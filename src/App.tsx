import { useState } from 'react'
import {
  TextField,
  Stack,
  Button,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Rating,
  Divider,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Container,
  Paper,
  AppBar,
  Toolbar,
} from '@mui/material'

type Album = {
  id: number
  title: string
  artist: string
  imageUrl: string
  rating: number
  genre: string
}

function App() {
  const [albums, setAlbums] = useState<Album[]>([])
  const [title, setTitle] = useState<string>('')
  const [artist, setArtist] = useState<string>('')
  const [imageUrl, setImageUrl] = useState<string>('')
  const [rating, setRating] = useState<number>(3)
  const [genre, setGenre] = useState<string>('J-Pop')
  const [showAlert, setShowAlert] = useState<boolean>(false)

  // 検索・絞り込み用の state
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [filterGenre, setFilterGenre] = useState<string>('All')

  // アルバム追加処理
  const handleAddAlbum = () => {
    if (!title.trim() || !artist.trim()) return

    const newAlbum: Album = {
      id: Date.now(),
      title,
      artist,
      imageUrl: imageUrl || 'https://via.placeholder.com/150',
      rating,
      genre: genre || 'Other',
    }

    setAlbums([...albums, newAlbum])
    setTitle('')
    setArtist('')
    setImageUrl('')
    setRating(3)
    setGenre('J-Pop')
    setShowAlert(true)
  }

  // アルバム削除処理
  const handleDeleteAlbum = (id: number) => {
    setAlbums(albums.filter((album) => album.id !== id))
  }

  // 検索キーワードとジャンルによるフィルタリング
  const filteredAlbums = albums.filter((album) => {
    const matchesQuery =
      album.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      album.artist.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesGenre =
      filterGenre === 'All' || album.genre === filterGenre

    return matchesQuery && matchesGenre
  })

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* 画面ヘッダー */}
      <AppBar position="static" className="mb-8">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            音楽アルバム管理
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md">
        {/* 登録成功時のアラート */}
        {showAlert && (
          <Alert
            severity="success"
            onClose={() => setShowAlert(false)}
            className="mb-6"
          >
            アルバムを登録しました！
          </Alert>
        )}

        {/* 登録フォーム */}
        <Paper elevation={3} className="p-6">
          <Stack spacing={2}>
            <TextField
              label="アルバム名"
              variant="outlined"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
            />
            <TextField
              label="アーティスト名"
              variant="outlined"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              fullWidth
            />
            <TextField
              label="アルバム画像リンク（URL）"
              variant="outlined"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel id="genre-select-label">ジャンル</InputLabel>
              <Select
                labelId="genre-select-label"
                id="genre-select"
                value={genre}
                label="ジャンル"
                onChange={(e) => setGenre(e.target.value)}
              >
                <MenuItem value="J-Pop">J-Pop</MenuItem>
                <MenuItem value="Rock">Rock</MenuItem>
                <MenuItem value="Jazz">Jazz</MenuItem>
                <MenuItem value="Classical">Classical</MenuItem>
                <MenuItem value="Hip Hop">Hip Hop</MenuItem>
              </Select>
            </FormControl>
            <div>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                お気に入り度
              </Typography>
              <Rating
                value={rating}
                onChange={(_, newValue) => {
                  if (newValue !== null) setRating(newValue)
                }}
              />
            </div>
            <Button variant="contained" onClick={handleAddAlbum}>
              アルバムを登録
            </Button>
          </Stack>
        </Paper>

        {/* 検索・絞り込みバー */}
        <Paper elevation={1} className="p-4 mt-8">
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              label="アルバム・アーティストを検索"
              variant="outlined"
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              fullWidth
            />
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel id="filter-genre-label">ジャンルで絞り込み</InputLabel>
              <Select
                labelId="filter-genre-label"
                id="filter-genre"
                value={filterGenre}
                label="ジャンルで絞り込み"
                onChange={(e) => setFilterGenre(e.target.value)}
              >
                <MenuItem value="All">すべて</MenuItem>
                <MenuItem value="J-Pop">J-Pop</MenuItem>
                <MenuItem value="Rock">Rock</MenuItem>
                <MenuItem value="Jazz">Jazz</MenuItem>
                <MenuItem value="Classical">Classical</MenuItem>
                <MenuItem value="Hip Hop">Hip Hop</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Paper>

        {/* アルバム一覧表示 */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredAlbums.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <Typography variant="body1" color="text.secondary">
                該当するアルバムが見つかりませんでした。
              </Typography>
            </div>
          ) : (
            filteredAlbums.map((album) => (
              <Card key={album.id}>
                <CardMedia
                  component="img"
                  height="180"
                  image={album.imageUrl}
                  alt={album.title}
                />
                <CardContent>
                  <Typography variant="h6" component="div" noWrap>
                    {album.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {album.artist}
                  </Typography>
                  <div className="my-2">
                    <Chip label={album.genre} size="small" color="primary" />
                  </div>
                  <Rating value={album.rating} readOnly size="small" />
                </CardContent>
                <Divider />
                <CardActions>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleDeleteAlbum(album.id)}
                  >
                    削除
                  </Button>
                </CardActions>
              </Card>
            ))
          )}
        </div>
      </Container>
    </div>
  )
}

export default App